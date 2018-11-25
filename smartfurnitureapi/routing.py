from django.urls import path

from smartfurnitureapi import consumers

websocket_urlpatterns = [
    path('notifications/', consumers.NotificationConsumer),
]
