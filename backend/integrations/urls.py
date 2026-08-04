from django.urls import path

from . import views

urlpatterns = [
    path("smartthings/login/", views.login),
    path("smartthings/callback/", views.callback),
    path("smartthings/", views.smartthings_webhook),
]