from django.urls import path, include

from smartfurnitureapi import api_views

urlpatterns = [
    path('', include('rest_auth.urls')),
    path('register/', include('rest_auth.registration.urls')),

    path('users/', api_views.UserList.as_view(), name='users'),
    path('users/<int:pk>/', api_views.UserDetail.as_view(), name='user-detail'),
    path('furniture/', api_views.FurnitureList.as_view(), name='furniture'),
    path('furniture/<int:pk>/', api_views.FurnitureDetail.as_view(), name='furniture-detail'),
    path('options/', api_views.OptionsList.as_view(), name='options'),
    path('options/<int:pk>/', api_views.OptionsDetail.as_view(), name='options-detail'),
    path('reviews/', api_views.LeaveReview.as_view(), name='reviews'),
    path('reviews/<int:pk>/', api_views.ReviewDetail.as_view(), name='reviews-detail'),
    path('reviews/<slug:manufacturer>/', api_views.ManufacturerReviewList.as_view(), name='manufacturer-reviews'),
    path('notifications/', api_views.NotificationList.as_view(), name='notifications'),
    path('notifications/<int:pk>/', api_views.NotificationDetail.as_view(), name='notifications-detail'),

    path('apply-options/', api_views.ApplyOptions.as_view(), name='apply-options'),
    path('discard-options/', api_views.DiscardOptions.as_view(), name='discard-options'),
    path('furniture-types/', api_views.FurnitureTypeList.as_view(), name='furniture-types'),
    path('massage-rigidity-types/', api_views.MassageAndRigidityTypeList.as_view(), name='massage-rigidity-types'),
    path('set-prime/', api_views.SetPrimeAccount.as_view(), name='set-prime'),
    path('disallow/', api_views.DisallowUser.as_view(), name='disallow'),
    path('allow/', api_views.AllowUser.as_view(), name='allow'),
]
