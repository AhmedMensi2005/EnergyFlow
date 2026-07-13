from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/",
        include("authentication.urls")
    ),
    path('admin/', admin.site.urls),
    path("api/", include("monitoring.urls")),
    path("api/", include("rooms.urls")),
]