from django.contrib.auth import get_user_model
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

UserModel = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['pk', 'image', 'username', 'email', 'first_name', 'last_name', 'height', 'owned_furniture',
                  'current_furniture', 'options_set']
        read_only_fields = ['owned_furniture', 'current_furniture', 'options_set']
