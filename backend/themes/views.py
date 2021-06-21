import pprint
import json
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers


class ThemeList(APIView):
    def get(self, request):
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 10)

        theme_list = models.Theme.objects.get_queryset().order_by("-created")

        paginator = Paginator(theme_list, offset)

        try:
            serializer = serializers.ThemeSerializer(paginator.page(page), many=True)
            return Response(serializer.data)
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        data = json.loads(request.data.pop("data")[0])

        user = request.user
        if not user.is_anonymous and user.is_editor:
            data["is_verified"] = True

        serializer = serializers.ThemeSerializer(
            data=data,
            files=request.FILES,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class ThemeDetail(APIView):
    def put(self, request, id):
        theme = models.Theme.objects.get_or_none(id=id)
        if theme is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = json.loads(request.data.get("data"))
        user = request.user
        if not user.is_anonymous and user.is_editor:
            data["is_verified"] = True

        serializer = serializers.ThemeSerializer(
            theme,
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
        theme = models.Theme.objects.get_or_none(id=id)
        if theme is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = serializers.ThemeSerializer(theme).data
        theme.delete()

        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class SearchTag(APIView):
    def get(self, request, search):
        tags = models.ThemeTag.objects.filter(Q(tags__title__icontains=search))
        serializer = serializers.TagSerializer(tags, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# 나중에 규모가 커질경우 사용
class SearchWithTitleOrTag(APIView):
    def get(self, request, search):
        themes = models.Theme.objects.filter(
            Q(title__icontains=search) | Q(tags__title__icontains=search)
        )
        serializer = serializers.ThemeSerializer(themes, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class RecentLink(APIView):
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
            links,
            status=status.HTTP_200_OK,
        )
