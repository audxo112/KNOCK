import pprint
import json
from datetime import datetime
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers
from core.mixins import RandomMixin
from api.permissions import IsEditor, IsThemeOwnerOrEditor


class ThemeList(APIView, RandomMixin):
    permission_classes = (AllowAny,)

    def get(self, request):
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)
        self.apply_random(page)

        theme_list = models.Theme.objects.filter(
            is_pending=False,
            is_public=True,
            owner__upload_stop_period__lte=datetime.now(),
            post_start_datetime__lte=datetime.now(),
            post_end_datetime__gte=datetime.now(),
        ).order_by("?")

        paginator = Paginator(theme_list, offset)

        try:
            serializer = serializers.ThemeSerializer(paginator.page(page), many=True)
            return Response({"items": serializer.data}, status=status.HTTP_200_OK)
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)


# 인증된 유저만 업로드 하기위해
class UploadTheme(APIView):
    def post(self, request):
        data = json.loads(request.data.pop("data")[0])

        if request.user and request.user.is_editor:
            data["is_verified"] = True

        serializer = serializers.ThemeSerializer(
            data=data,
            files=request.FILES,
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"item": serializer.data}, status=status.HTTP_201_CREATED)

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class ThemeListInEditor(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)

        theme_list = models.Theme.objects.get_queryset().order_by("-created")

        paginator = Paginator(theme_list, offset)

        try:
            serializer = serializers.ThemeSerializer(paginator.page(page), many=True)
            return Response({"items": serializer.data})
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)


class ThemeDetail(APIView):
    permission_classes = (IsThemeOwnerOrEditor,)

    def put(self, request, theme_id):
        theme = models.Theme.objects.get_or_none(id=theme_id)
        if theme is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = json.loads(request.data.get("data"))

        serializer = serializers.ThemeSerializer(
            theme,
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

    def delete(self, request, theme_id):
        theme = models.Theme.objects.get_or_none(id=theme_id)
        if theme is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = serializers.ThemeSerializer(theme).data
        theme.delete()

        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )


class SearchTag(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, search):
        tags = models.ThemeTag.objects.filter(Q(tags__title__icontains=search))
        # 사용된 수 같은 order 추가하기!

        serializer = serializers.TagSerializer(tags, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )


# 나중에 규모가 커질경우 사용
class SearchWithTitleOrTag(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, search):
        themes = models.Theme.objects.filter(
            Q(title__icontains=search) | Q(tags__title__icontains=search)
        )
        # 좋아요순 같은 order 추가하기 !

        serializer = serializers.ThemeSerializer(themes, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )


class RecentLink(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        # postgreSQL 에서 사용 가능
        # links = (
        #     models.Theme.objects.filter(~Q(link=""))
        #     .values("created", "link")
        #     .order_by("-created")
        #     .distinct("link")
        # )

        links = (
            models.Theme.objects.filter(~Q(link=""))
            .values_list("link", flat=True)
            .distinct()
        )

        return Response(
            {"items": links},
            status=status.HTTP_200_OK,
        )
