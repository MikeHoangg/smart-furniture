from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from smartfurnitureapi import models, serializers


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
        return Response({"detail": "Options applied."}, status=status.HTTP_202_ACCEPTED)


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
        return Response({"detail": "Options discarded."}, status=status.HTTP_202_ACCEPTED)
