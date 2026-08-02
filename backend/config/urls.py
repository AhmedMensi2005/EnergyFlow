from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    path(
        "api/",
        include("authentication.urls")
    ),

    path(
        "api/",
        include("monitoring.urls")
    ),

    path(
        "api/",
        include("rooms.urls")
    ),

    path(
        "admin/",
        admin.site.urls
    ),

]