import pprint
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from . import models, serializers


class FrameList(APIView):
    def get(self, request):
        priority = request.GET.get("priority", None)
        if priority is None:
            frames = models.ThemeFrame.objects.all().order_by(
                "-priority",
                "-order",
            )
        else:
            frames = models.ThemeFrame.objects.filter(priority=priority).order_by(
                "-order"
            )
        serializer = serializers.ThemeFrameSerializer(frames, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = json.loads(request.data.pop("data")[0])

        user = request.user
        if not user.is_anonymous and user.is_editor:
            data["is_verified"] = True

        serializer = serializers.ThemeFrameSerializer(
            data=data,
            files=request.FILES,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request):
        ids = [item["id"] for item in request.data]
        frames = models.ThemeFrame.objects.filter(id__in=ids)

        serializer = serializers.ThemeFrameOrderSerializer(
            frames, data=request.data, many=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_200_OK,
        )


class FrameMaxPriority(APIView):
    def get(self, request):
        try:
            frame = models.ThemeFrame.objects.latest("priority")
            return HttpResponse(
                frame.priority,
                status=status.HTTP_200_OK,
            )
        except ObjectDoesNotExist:
            return HttpResponse(
                status=status.HTTP_204_NO_CONTENT,
            )


class FrameDetail(APIView):
    def put(self, request, id):
        frame = models.ThemeFrame.objects.get_or_none(id=id)
        if frame is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        pprint.pprint(request.data)
        data = json.loads(request.data.get("data"))

        serializer = serializers.ThemeFrameSerializer(
            frame,
            data=data,
            partial=True,
            files=request.FILES,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, id):
        frame = models.ThemeFrame.objects.get_or_none(id=id)
        if frame is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.ThemeFrameSerializer(frame).data
        frame.delete()

        return Response(
            data,
            status=status.HTTP_200_OK,
        )


# def get_client_ip(request):
#     x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(",")[0]
#     else:
#         ip = request.META.get("REMOTE_ADDR")
#     return ip
