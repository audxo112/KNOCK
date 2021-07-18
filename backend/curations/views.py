import pprint
import json
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers
from api.permissions import IsEditor


class CurationList(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        curations = models.ThemeCurationGroup.objects.filter(
            post_start_datetime__gte=timezone.now(),
            post_end_datetime__lte=timezone.now(),
        )
        # 앱에서 사용할 데이터에 따라 Serializer 를 생성
        serializer = serializers.GroupMenuSerializer(curations, many=True)

        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )


class CurationMenuList(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        curations = models.ThemeCurationGroup.objects.filter(
            post_end_datetime__gte=timezone.now()
        )
        serializer = serializers.GroupMenuSerializer(curations, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )


class GroupList(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        isActive = request.GET.get("is_active")
        if isActive is None:
            groups = models.ThemeCurationGroup.objects.all().order_by("-order")
        elif isActive == "true" or isActive == "True":
            groups = models.ThemeCurationGroup.objects.filter(
                post_end_datetime__gte=timezone.now()
            ).order_by("-order")
        else:
            groups = models.ThemeCurationGroup.objects.filter(
                post_end_datetime__lte=timezone.now()
            ).order_by("-order")
        serializer = serializers.GroupSerializer(groups, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        pprint.pprint(request.data)
        serializer = serializers.GroupSerializer(data=request.data)
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
        groups = models.ThemeCurationGroup.objects.filter(id__in=ids)

        serializer = serializers.GroupOrderSerializer(
            groups, data=request.data, many=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )
        pprint.pprint(serializer.errors)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class GroupDetail(APIView):
    permission_classes = (IsEditor,)

    def put(self, request, group_id):
        group = models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        serializer = serializers.GroupSerializer(
            group,
            data=request.data,
            partial=True,
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

    def delete(self, request, group_id):
        group = models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.GroupSerializer(group).data
        group.delete()
        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )


class FolderList(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        group_id = request.GET.get("group_id", None)
        if group_id is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
            )
        folders = models.ThemeCurationFolder.objects.filter(
            group__id=group_id,
        ).order_by("-order")
        serializer = serializers.FolderSerializer(folders, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        data = json.loads(request.data.pop("data")[0])

        serializer = serializers.FolderSerializer(
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
        folders = models.ThemeCurationFolder.objects.filter(id__in=ids)

        serializer = serializers.FolderOrderSerializer(
            folders, data=request.data, many=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class FolderDetail(APIView):
    permission_classes = (IsEditor,)

    def put(self, request, folder_id):
        folder = models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = json.loads(request.data.get("data"))

        serializer = serializers.FolderSerializer(
            folder,
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

    def delete(self, request, folder_id):
        folder = models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.FolderSerializer(folder).data
        folder.delete()
        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )
