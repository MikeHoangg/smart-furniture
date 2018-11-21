import calendar
import datetime

import stripe
from django.conf import settings

from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from smartfurnitureapi import models, serializers, types


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'creator'):
            return obj.creator == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'sender'):
            return obj.sender == request.user or obj.receiver == request.user


class FurnitureTypeList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.FurnitureTypeSerializer

    @staticmethod
    def get_types_info(types_arr, type_name):
        return [{'name': i[0], 'type': type_name, 'prime_actions': i[0] in types.PRIME_FURNITURE_TYPES} for i in
                types_arr]

    def get_queryset(self):
        self.queryset = self.get_types_info(types.MULTI_FURNITURE_TYPES, 'multi') + self.get_types_info(
            types.SOLO_FURNITURE_TYPES, 'solo')
        return super().get_queryset()


class MassageAndRigidityTypeList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.MassageAndRigidityTypeSerializer

    @staticmethod
    def get_types_info(types_arr, type_name):
        return [{'name': i[0], 'type': type_name} for i in types_arr]

    def get_queryset(self):
        self.queryset = self.get_types_info(types.MASSAGE, 'massage') + self.get_types_info(types.RIGIDITY, 'rigidity')
        return super().get_queryset()


class UserList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class UserDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class FurnitureList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Furniture.objects.all()
    serializer_class = serializers.FurnitureSerializer


class FurnitureDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Furniture.objects.all()
    serializer_class = serializers.FurnitureSerializer


class OptionsList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Options.objects.all()
    serializer_class = serializers.OptionsSerializer


class OptionsDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Options.objects.all()
    serializer_class = serializers.OptionsSerializer


class ReportList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer


class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer

    def perform_update(self, serializer):
        serializer.save(date=timezone.now())


class NotificationList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer


class NotificationDetail(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer


class ManufacturerReportList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.ReportSerializer

    def get_queryset(self):
        return models.Report.objects.filter(furniture__manufacturer=self.kwargs.get('manufacturer'))


class ApplyOptions(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.ApplyOptionsSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.POST.get('furniture'))
        options = models.Options.objects.get(id=request.POST.get('options'))
        furniture.current_users.add(options.creator)
        furniture.current_options.add(options)
        furniture.save()
        return Response({_('detail'): _('Options applied.')}, status=status.HTTP_202_ACCEPTED)


class DiscardOptions(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.DiscardOptionsSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.POST.get('furniture'))
        user = models.User.objects.get(id=request.POST.get('user'))
        furniture.current_users.remove(user)
        for options in furniture.current_options.all():
            if options.creator == user:
                furniture.current_options.remove(options)
                break
        furniture.save()
        return Response({_('detail'): _('Options discarded.')}, status=status.HTTP_202_ACCEPTED)


class SetPrimeAccount(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.PrimeAccountSerializer

    @staticmethod
    def create_charge(user, stripe_token, price, expiration_date):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            stripe.Charge.create(
                amount=price,
                currency="usd",
                source=stripe_token,
                description=f"{user.username} - {user.email} has prime access until {expiration_date}",
            )
        except stripe.error.CardError:
            return False
        else:
            user.prime_expiration_date = expiration_date
            user.save()
            return True

    def create(self, request, *args, **kwargs):
        user = models.User.objects.get(id=request.POST.get('user'))
        stripe_token = request.POST.get('stripe_token')
        price = request.POST.get('price')
        now = timezone.now()
        expiration_date = now + datetime.timedelta(days=calendar.monthrange(now.year, now.month)[1])
        result = self.create_charge(user, stripe_token, price, expiration_date)
        if result:
            msg = _(f'Successfully upgraded to prime account till {expiration_date}.')
            stat = status.HTTP_201_CREATED
        else:
            msg = _(f'Your card was declined.')
            stat = status.HTTP_406_NOT_ACCEPTABLE
        return Response({_('detail'): msg}, status=stat)
