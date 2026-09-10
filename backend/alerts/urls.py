from django.urls import path

from .views import (
    AlertListView,
    AlertDetailView,
    AlertUpdateView,
    AlertRuleListCreateView,
    AlertRuleDetailView,
)


urlpatterns = [

    # ============================================================
    # ALERTS
    # ============================================================

    path(
        "",
        AlertListView.as_view(),
        name="alert-list"
    ),

    path(
        "<int:pk>/",
        AlertDetailView.as_view(),
        name="alert-detail"
    ),

    path(
        "<int:pk>/update/",
        AlertUpdateView.as_view(),
        name="alert-update"
    ),


    # ============================================================
    # ALERT RULES
    # ============================================================

    path(
        "rules/",
        AlertRuleListCreateView.as_view(),
        name="alert-rule-list"
    ),

    path(
        "rules/<int:pk>/",
        AlertRuleDetailView.as_view(),
        name="alert-rule-detail"
    ),
]