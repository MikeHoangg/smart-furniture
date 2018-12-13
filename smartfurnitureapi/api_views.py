import calendar
import datetime

import stripe
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils.translation import get_language
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
        return [{'name': i[0], 'verbose_name': i[1], 'type': type_name,
                 'prime_actions': i[0] in types.PRIME_FURNITURE_TYPES} for i in
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
        return [{'name': i[0], 'verbose_name': i[1], 'type': type_name} for i in types_arr]

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

    def get_serializer_class(self):
        method = self.request.method
        if method in ('POST', 'PUT'):
            return serializers.WriteFurnitureSerializer
        else:
            return serializers.ReadFurnitureSerializer


class FurnitureDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Furniture.objects.all()

    def get_serializer_class(self):
        method = self.request.method
        if method in ('POST', 'PUT'):
            return serializers.WriteFurnitureSerializer
        else:
            return serializers.ReadFurnitureSerializer


class OptionsList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Options.objects.all()
    serializer_class = serializers.OptionsSerializer


class OptionsDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Options.objects.all()
    serializer_class = serializers.OptionsSerializer


class LeaveReview(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.Review.objects.all()
    serializer_class = serializers.WriteReviewSerializer

    def create(self, request, *args, **kwargs):
        user = models.User.objects.get(id=request.data.get('user'))
        furniture = models.Furniture.objects.get(id=request.data.get('furniture'))
        if models.Review.objects.filter(user=user, furniture=furniture):
            if get_language() == 'uk':
                msg = 'Ви вже залишили рицензію на ці меблі'
            else:
                msg = 'You have already reviewed this piece of furniture'
            return Response({'furniture': msg},
                            status=status.HTTP_406_NOT_ACCEPTABLE)
        return super().create(request, *args, **kwargs)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)
    queryset = models.Review.objects.all()
    serializer_class = serializers.WriteReviewSerializer

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


class BrandReviewList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.ReadReviewSerializer

    def get(self, request, *args, **kwargs):
        if not models.Furniture.objects.filter(brand=self.kwargs.get('brand')).exists():
            return Response({'detail': _('Not found.')}, status=status.HTTP_404_NOT_FOUND)
        else:
            return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return models.Review.objects.filter(furniture__brand=self.kwargs.get('brand'))


class ApplyOptions(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.FurnitureUserSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.data.get('furniture'))
        options = models.Options.objects.get(id=request.data.get('options'))
        if furniture.current_users.count() >= 5:
            if get_language() == 'uk':
                msg = f'Опції не застосовано до меблів {furniture}, тому що меблями ліміт користувачів досягнено.'
            else:
                msg = f'Couldn\'t apply options to furniture {furniture} because user limit has been reached.'
            stat = status.HTTP_406_NOT_ACCEPTABLE
        elif options.creator in furniture.current_users.all():
            for options in furniture.current_options.all():
                if options.creator == options.creator:
                    furniture.current_options.remove(options)
                    furniture.current_options.add(options)
                    break
            if get_language() == 'uk':
                msg = f'Опції застосовано до меблів {furniture}'
            else:
                msg = f'Options applied to furniture {furniture}.'
            stat = status.HTTP_202_ACCEPTED
        elif furniture.type in types.SOLO_FURNITURE_TYPES and furniture.current_users.count():
            if get_language() == 'uk':
                msg = f'Опції не застосовано до меблів {furniture}, тому що меблями користується {furniture.current_users.first()}.'
            else:
                msg = f'Couldn\'t apply options to furniture {furniture} because user {furniture.current_users.first()} is using it.'
            stat = status.HTTP_406_NOT_ACCEPTABLE
        elif not furniture.is_public and options.creator not in furniture.allowed_users.all() and options.creator != furniture.owner:
            if get_language() == 'uk':
                msg = f'Опції не застосовано до меблів {furniture}, тому що у вас немає доступу.'
            else:
                msg = f'Couldn\'t apply options to furniture  {furniture} because you have no access to it.'
            stat = status.HTTP_405_METHOD_NOT_ALLOWED
        else:
            furniture.current_users.add(options.creator)
            furniture.current_options.add(options)
            if get_language() == 'uk':
                msg = f'Опції застосовано до меблів {furniture}.'
            else:
                msg = f'Options applied to furniture {furniture}.'
            stat = status.HTTP_202_ACCEPTED
        return Response({'detail': msg}, status=stat)


class DiscardOptions(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.FurnitureUserSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.data.get('furniture'))
        user = models.User.objects.get(id=request.data.get('user'))
        furniture.current_users.remove(user)
        for options in furniture.current_options.all():
            if options.creator == user:
                furniture.current_options.remove(options)
                break
        if get_language() == 'uk':
            msg = f'Опції зняті з меблів {furniture}.'
        else:
            msg = f'Options discarded from furniture {furniture}.'
        return Response({'detail': msg}, status=status.HTTP_202_ACCEPTED)


class DisallowUser(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.FurnitureUserSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.data.get('furniture'))
        user = models.User.objects.get(id=request.data.get('user'))
        notification = models.Notification.objects.get(id=request.data.get('notification'))
        notification.pending = False
        notification.save()
        furniture.allowed_users.remove(user)
        for options in furniture.current_options.all():
            if options.creator == user:
                furniture.current_options.remove(options)
                break
        if get_language() == 'uk':
            msg = f'Користувачу {user} не дозволено користуватися меблями {furniture}.'
        else:
            msg = f'User {user} is disallowed to use furniture {furniture}.'
        return Response({'detail': msg},
                        status=status.HTTP_202_ACCEPTED)


class AllowUser(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = serializers.FurnitureUserSerializer

    def create(self, request, *args, **kwargs):
        furniture = models.Furniture.objects.get(id=request.data.get('furniture'))
        user = models.User.objects.get(id=request.data.get('user'))
        notification = models.Notification.objects.get(id=request.data.get('notification'))
        notification.pending = False
        notification.save()
        furniture.allowed_users.add(user)
        if get_language() == 'uk':
            msg = f'Користувачу {user} дозволено користуватися меблями {furniture}.'
        else:
            msg = f'User {user} is allowed to use furniture {furniture}.'
        return Response({'detail': msg},
                        status=status.HTTP_202_ACCEPTED)


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
        user = models.User.objects.get(id=request.data.get('user'))
        stripe_token = request.data.get('stripe_token')
        price = request.data.get('price')
        now = timezone.now()
        expiration_date = now + datetime.timedelta(days=calendar.monthrange(now.year, now.month)[1])
        result = self.create_charge(user, stripe_token, price, expiration_date)
        if result:
            if get_language() == 'uk':
                msg = f'Успішне оновлення до prime облікового запису {expiration_date}.'
            else:
                msg = f'Successfully upgraded to prime account till {expiration_date}.'
            stat = status.HTTP_201_CREATED
        else:
            if get_language() == 'uk':
                msg = f'Вашу карту відхилено.'
            else:
                msg = f'Your card was declined.'
            stat = status.HTTP_406_NOT_ACCEPTABLE
        return Response({'detail': msg}, status=stat)
