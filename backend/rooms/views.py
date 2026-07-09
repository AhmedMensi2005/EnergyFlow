from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Room
from .serializer import RoomSerializer

# Create your views here.


class RoomListAPIView(APIView):
    
    def get(self, request):
        search = request.query_params.get("search")
        if search:
            rooms = Room.objects.filter(name__icontains=search)
        else:
            rooms = Room.objects.all()

        serializer = RoomSerializer(rooms,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#with id parametre
class RoomDetailAPIView(APIView):

    def get_object(self,id):
        return get_object_or_404(Room,id=id)
    
    def get(self,request,id):
        room = self.get_object(id)
        serializer = RoomSerializer(room)
        return Response(serializer.data)
    
    
    def put(self,request,id):
        room = self.get_object(id)
        serializer = RoomSerializer(room,data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        room = self.get_object(id)
        room.delete()
        return Response({"message":"Room deleted successfully"}, status=status.HTTP_204_NO_CONTENT)