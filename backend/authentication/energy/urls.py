from django.urls import path
from .views import EnergyListView


urlpatterns = [

    path(
        "",
        EnergyListView.as_view()
    ),

]