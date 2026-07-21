from django.urls import path, include


urlpatterns = [
    path("auth/", include("authentication.auth.urls")),
    path("users/", include("authentication.users.urls")),
]