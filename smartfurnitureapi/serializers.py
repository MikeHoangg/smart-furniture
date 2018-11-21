from django.contrib.auth import get_user_model
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from smartfurnitureapi.models import Furniture, Options, Report, Notification

UserModel = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)


class FurnitureTypeSerializer(serializers.Serializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    prime_actions = serializers.SerializerMethodField()

    @staticmethod
    def get_type(obj):
        return obj['type']

    @staticmethod
    def get_name(obj):
        return obj['name']

    @staticmethod
    def get_prime_actions(obj):
        return obj['prime_actions']


class MassageAndRigidityTypeSerializer(serializers.Serializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    @staticmethod
    def get_type(obj):
        return obj['type']

    @staticmethod
    def get_name(obj):
        return obj['name']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['pk', 'image', 'username', 'email', 'first_name', 'last_name', 'height', 'owned_furniture',
                  'current_furniture', 'options_set', 'prime_expiration_date', 'is_superuser']
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
        fields = ['pk', 'type', 'name', 'height', 'length', 'width', 'incline', 'temperature', 'massage', 'rigidity',
                  'creator']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['pk', 'content', 'rating', 'date', 'user', 'furniture']
        read_only_fields = ['date']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['pk', 'content', 'date', 'pending', 'receiver', 'sender']
        read_only_fields = ['date']


class ApplyOptionsSerializer(serializers.Serializer):
    furniture = serializers.PrimaryKeyRelatedField(queryset=Furniture.objects.all())
    options = serializers.PrimaryKeyRelatedField(queryset=Options.objects.all())


class DiscardOptionsSerializer(serializers.Serializer):
    furniture = serializers.PrimaryKeyRelatedField(queryset=Furniture.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=UserModel.objects.all())


class PrimeAccountSerializer(serializers.Serializer):
    stripe_token = serializers.CharField(required=True)
    user = serializers.PrimaryKeyRelatedField(queryset=UserModel.objects.all())
    price = serializers.IntegerField(required=True)
