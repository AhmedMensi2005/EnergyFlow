from urllib.parse import urlencode

from config import settings


def authorization_url():

    params = {
        "client_id": settings.SMARTTHINGS_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SMARTTHINGS_REDIRECT_URI,
        "scope": "r:devices:* r:locations:*",
    }

    return (
        "https://api.smartthings.com/oauth/authorize?"
        + urlencode(params)
    )