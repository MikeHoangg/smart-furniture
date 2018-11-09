from django.contrib.auth import get_user_model
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from smartfurnitureapi.models import Furniture, Options, Report, Notification

UserModel = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['pk', 'image', 'username', 'email', 'first_name', 'last_name', 'height', 'owned_furniture',
                  'current_furniture', 'options_set']
        read_only_fields = ['owned_furniture', 'current_furniture', 'options_set']


class FurnitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Furniture
        fields = ['pk', 'code', 'manufacturer', 'type', 'is_public', 'owner', 'current_users', 'allowed_users',
                  'current_options']
        read_only_fields = ['current_users', 'allowed_users', 'current_options']


class OptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = ['pk', 'type', 'name', 'height', 'length', 'width', 'incline', 'rigidity', 'creator']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['pk', 'content', 'rating', 'date', 'user', 'furniture']
        read_only_fields = ['date']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['pk', 'content', 'date', 'receiver', 'sender']
        read_only_fields = ['date']


class ApplyOptionsSerializer(serializers.Serializer):
    furniture = serializers.PrimaryKeyRelatedField(queryset=Furniture.objects.all())
    options = serializers.PrimaryKeyRelatedField(queryset=Options.objects.all())


class DiscardOptionsSerializer(serializers.Serializer):
    furniture = serializers.PrimaryKeyRelatedField(queryset=Furniture.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=UserModel.objects.all())
