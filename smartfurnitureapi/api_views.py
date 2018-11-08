from rest_framework import generics, permissions

from smartfurnitureapi import models, serializers


class UserList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class UserDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
