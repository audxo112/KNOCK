import pprint
import json
from django.core.paginator import Paginator, EmptyPage
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from . import models, serializers
from api.permissions import IsEditor, IsFrameOwnerOrEditor


class FrameList(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)

        frames = models.ThemeFrame.objects.get_queryset().order_by(
            "-priority",
            "-order",
        )

        paginator = Paginator(frames, offset)

        try:
            serializer = serializers.ThemeFrameSerializer(
                paginator.page(page), many=True
            )
            return Response(
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)


class FrameListInEditor(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        priority = request.GET.get("priority", None)
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)

        if priority is None:
            frames = models.ThemeFrame.objects.get_queryset().order_by(
                "-priority",
                "-order",
            )
        else:
            frames = models.ThemeFrame.objects.filter(priority=priority).order_by(
                "-order"
            )

        paginator = Paginator(frames, offset)

        try:
            serializer = serializers.ThemeFrameSerializer(
                paginator.page(page), many=True
            )
            return Response(
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        data = json.loads(request.data.get("data"))

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
                {"item": serializer.data},
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
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_200_OK,
        )


class FrameMaxPriority(APIView):
    permission_classes = (IsEditor,)

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
    permission_classes = (IsFrameOwnerOrEditor,)

    def put(self, request, frame_id):
        frame = models.ThemeFrame.objects.get_or_none(id=frame_id)
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
                {"item": serializer.data},
                status=status.HTTP_200_OK,
            )

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, frame_id):
        frame = models.ThemeFrame.objects.get_or_none(id=frame_id)
        if frame is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.ThemeFrameSerializer(frame).data
        frame.delete()

        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )


# def get_client_ip(request):
#     x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(",")[0]
#     else:
#         ip = request.META.get("REMOTE_ADDR")
#     return ip
