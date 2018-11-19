from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, RegexValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from smartfurnitureapi import types


class User(AbstractUser):
    email = models.EmailField(unique=True,
                              verbose_name=_("Email"))
    image = models.ImageField(null=True,
                              blank=True,
                              verbose_name=_("Image"))
    height = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True,
                               verbose_name=_("Height"))

    def __str__(self):
        return self.email


class Furniture(models.Model):
    code = models.CharField(unique=True,
                            max_length=16,
                            validators=[RegexValidator(
                                regex="^\w+$",
                                message=_('Code should have only latin symbols and numbers.')
                            )],
                            verbose_name=_("Code"))
    manufacturer = models.SlugField(max_length=64,
                                    verbose_name=_("Manufacturer"))
    type = models.CharField(max_length=32,
                            choices=types.SOLO_FURNITURE_TYPES + types.MULT_FURNITURE_TYPES,
                            verbose_name=_("Type"))
    is_public = models.BooleanField(verbose_name=_("Is public"))
    owner = models.ForeignKey('User',
                              on_delete=models.CASCADE,
                              related_name='owned_furniture',
                              verbose_name=_("Owner"))
    current_users = models.ManyToManyField('User',
                                           related_name='current_furniture',
                                           verbose_name=_("Current users"))
    allowed_users = models.ManyToManyField('User',
                                           related_name='allowed_furniture',
                                           verbose_name=_("Allowed users"))
    current_options = models.ManyToManyField('Options',
                                             verbose_name=_("Options"))

    def __str__(self):
        return f'{self.type} - {self.code}'


class Options(models.Model):
    type = models.CharField(max_length=32,
                            choices=types.SOLO_FURNITURE_TYPES + types.MULT_FURNITURE_TYPES,
                            verbose_name=_("Type"))
    name = models.CharField(max_length=32,
                            verbose_name=_("Name"))
    height = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True,
                               verbose_name=_("Height"))
    length = models.FloatField(validators=[MinValueValidator(0.0)],
                               null=True,
                               blank=True,
                               verbose_name=_("Length"))
    width = models.FloatField(validators=[MinValueValidator(0.0)],
                              null=True,
                              blank=True,
                              verbose_name=_("Width"))
    incline = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(180.0)],
                                default=95,
                                verbose_name=_("Incline"))
    rigidity = models.CharField(max_length=32,
                                choices=types.RIGIDITY,
                                default='medium',
                                verbose_name=_("Rigidity"))
    temperature = models.FloatField(verbose_name=_("Temperature"),
                                    default=36.6)
    massage = models.CharField(max_length=32,
                               choices=types.MASSAGE,
                               verbose_name=_("Massage"),
                               default='none')
    creator = models.ForeignKey('User',
                                on_delete=models.CASCADE,
                                verbose_name=_("Creator"))

    def __str__(self):
        return self.name


class Report(models.Model):
    content = models.TextField(verbose_name=_("Content"))
    rating = models.IntegerField(default=1,
                                 validators=[MaxValueValidator(5), MinValueValidator(1)],
                                 verbose_name=_("Rating"))
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey('User',
                             on_delete=models.CASCADE,
                             verbose_name=_("User"))
    furniture = models.ForeignKey('Furniture',
                                  on_delete=models.CASCADE,
                                  verbose_name=_("Furniture"))


class Notification(models.Model):
    content = models.TextField(verbose_name=_("Content"))
    date = models.DateTimeField(default=timezone.now,
                                verbose_name=_("Date"))
    receiver = models.ForeignKey('User',
                                 on_delete=models.CASCADE,
                                 related_name='received_notifications',
                                 verbose_name=_("Receiver"))
    sender = models.ForeignKey('User',
                               on_delete=models.CASCADE,
                               related_name='sent_notifications',
                               verbose_name=_("Sender"))
