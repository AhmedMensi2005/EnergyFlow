from django.urls import path

from .views import (
    AlertListView,
    AlertDetailView,
    AlertUpdateView,
    AlertRuleListCreateView,
    AlertRuleDetailView,
    AlertHeatmapView,
    UnsolvedAlertsAPIView,
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
        "heatmap/",
        AlertHeatmapView.as_view(),
        name="alert-heatmap"
    ),

    path(
        "unsolved/",
        UnsolvedAlertsAPIView.as_view(),
        name="unsolved-alerts"
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