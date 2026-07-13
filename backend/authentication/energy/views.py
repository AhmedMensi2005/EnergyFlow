from rest_framework.views import APIView
from rest_framework.response import Response


class EnergyListView(APIView):

    def get(self, request):

        return Response(
            {
                "message": "Energy data",
                "user": request.user.email
            }
        )