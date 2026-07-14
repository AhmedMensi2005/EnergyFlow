from django.contrib.auth.backends import BaseBackend
from authentication.models import Utilisateur


class EmailBackend(BaseBackend):

    def authenticate(
        self,
        request,
        email=None,
        password=None,
        **kwargs
    ):

        if email is None or password is None:
            return None


        try:
            user = Utilisateur.objects.get(
                email=email
            )

        except Utilisateur.DoesNotExist:
            return None


        if user.check_password(password):
            return user


        return None


    def get_user(self, user_id):

        try:
            return Utilisateur.objects.get(
                pk=user_id
            )

        except Utilisateur.DoesNotExist:
            return None