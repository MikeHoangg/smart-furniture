from django.contrib import admin

from smartfurnitureapi import models

admin.site.register(models.User)
admin.site.register(models.Furniture)
admin.site.register(models.Options)
admin.site.register(models.Report)
admin.site.register(models.Notification)
