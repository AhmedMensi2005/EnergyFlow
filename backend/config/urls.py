from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("api/", include("authentication.urls")),
    path('admin/', admin.site.urls),

    path("api/", include("rooms.urls")),
    path("api/", include("devices.urls")),
    path("api/",include("analytics.urls")),

    path("api/integrations/", include("integrations.urls")),
    path("api/alerts/", include("alerts.urls")),

]

