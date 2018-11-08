from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, RegexValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from smartfurnitureapi import types


class User(AbstractUser):
    email = models.EmailField(unique=True)
    image = models.ImageField(null=True,
                              blank=True)
    height = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True)

    def __str__(self):
        return self.email


class Furniture(models.Model):
    code = models.CharField(unique=True,
                            max_length=16,
                            validators=[RegexValidator(
                                regex="^\w+$",
                                message=_('Code should have only latin symbols and numbers.')
                            )])
    manufacturer = models.SlugField(max_length=64)
    type = models.CharField(max_length=32,
                            choices=types.SOLO_FURNITURE_TYPES + types.MULT_FURNITURE_TYPES)
    is_public = models.BooleanField()
    owner = models.ForeignKey('User',
                              on_delete=models.CASCADE,
                              related_name='owned_furniture')
    current_users = models.ManyToManyField('User',
                                           related_name='current_furniture')
    allowed_users = models.ManyToManyField('User',
                                           related_name='allowed_furniture')
    current_options = models.ManyToManyField('Options')

    def __str__(self):
        return f'{self.type} - {self.code}'


class Options(models.Model):
    type = models.CharField(max_length=32,
                            choices=types.SOLO_FURNITURE_TYPES + types.MULT_FURNITURE_TYPES)
    name = models.CharField(max_length=32)
    height = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True)
    length = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True)
    width = models.FloatField(validators=[MinValueValidator(0.0)],
                              null=True,
                              blank=True)
    incline = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(180.0)],
                                default=95)
    rigidity = models.CharField(max_length=32,
                                choices=types.RIGIDITY,
                                default='medium')
    creator = models.ForeignKey('User',
                                on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Report(models.Model):
    content = models.TextField()
    rating = models.IntegerField(default=1,
                                 validators=[MaxValueValidator(5), MinValueValidator(1)])
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('User',
                             on_delete=models.CASCADE)
    furniture = models.ForeignKey('Furniture',
                                  on_delete=models.CASCADE)


class Notification(models.Model):
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    receiver = models.ForeignKey('User',
                                 on_delete=models.CASCADE,
                                 related_name='received_notifications')
    sender = models.ForeignKey('User',
                               on_delete=models.CASCADE,
                               related_name='sent_notifications')
