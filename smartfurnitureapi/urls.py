from django.urls import path, include

from smartfurnitureapi import api_views

urlpatterns = [
    path('', include('rest_auth.urls')),
    path('registration/', include('rest_auth.registration.urls')),
    path('users/', api_views.UserList.as_view(), name='users'),
    path('users/<int:pk>/', api_views.UserDetail.as_view(), name='user-detail'),
]
