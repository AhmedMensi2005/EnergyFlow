from datetime import timedelta

import requests

from django.conf import settings
from django.shortcuts import redirect
from django.utils import timezone

from .models import SmartThingsIntegration
from .oauth import authorization_url

from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

def login(request):
    url = authorization_url()
    print(url)
    return redirect(url)


def callback(request):
    error = request.GET.get("error")
    if error:
        return HttpResponse(
            f"SmartThings authorization failed: {error} "
            f"({request.GET.get('error_description', '')})",
            status=400,
        )

    code = request.GET.get("code")
    if not code:
        return HttpResponse("Missing authorization code.", status=400)

    response = requests.post(
        "https://api.smartthings.com/oauth/token",
        data={
            "grant_type": "authorization_code",
            "redirect_uri": settings.SMARTTHINGS_REDIRECT_URI,
            "code": code,
        },
        auth=(settings.SMARTTHINGS_CLIENT_ID, settings.SMARTTHINGS_CLIENT_SECRET),
    )

    if response.status_code != 200:
        return HttpResponse(
            f"Token exchange failed ({response.status_code}): {response.text}",
            status=502,
        )

    tokens = response.json()

    SmartThingsIntegration.objects.update_or_create(
        id=1,
        defaults={
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "expires_at": timezone.now() + timedelta(seconds=tokens["expires_in"]),
        },
    )

    return redirect("/")


@csrf_exempt
def smartthings_webhook(request):
    body = json.loads(request.body)

    # Handle confirmation request
    if body.get("lifecycle") == "CONFIRMATION":

        confirmation_url = body["confirmationData"]["confirmationUrl"]

        # Tell SmartThings that you own this endpoint
        requests.get(confirmation_url)

        return JsonResponse({})