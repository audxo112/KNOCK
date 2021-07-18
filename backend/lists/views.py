import pprint
from datetime import datetime
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from curations import models as curation_models
from themes import models as theme_models
from api.permissions import IsEditor
from . import models, serializers


class ThemeList(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        group_id = request.GET.get("group_id", "")
        folder_id = request.GET.get("folder_id", "")
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)

        group = curation_models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        if group.view_type == curation_models.ThemeCurationGroup.VIEW_TYPE_LIST:
            return self.get_theme_list(group, None, page, offset)

        folder = curation_models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return self.get_theme_list(group, folder, page, offset)

    def get_theme_list(self, group, folder, page, offset):
        theme_list = models.ThemeList.objects.filter(
            group=group,
            folder=folder,
            theme__is_pending=False,
            theme__owner__upload_stop_period__gte=datetime.now(),
            theme__post_start_datetime__gte=datetime.now(),
            theme__post_end_datetime__lte=datetime.now(),
        ).order_by("-order")

        paginator = Paginator(theme_list, offset)

        try:
            serializer = serializers.ThemeInThemeListSerializer(
                paginator.page(page), many=True
            )
            return Response({"items": serializer.data}, status=status.HTTP_200_OK)
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)


class ThemeListInEditor(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        group_id = request.GET.get("group_id", "")
        folder_id = request.GET.get("folder_id", "")
        search = request.GET.get("search", "")
        filter = request.GET.get("filter", "registered")
        page = request.GET.get("page", 1)
        offset = request.GET.get("offset", 20)

        group = curation_models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        if group.view_type == curation_models.ThemeCurationGroup.VIEW_TYPE_LIST:
            return self.get_theme_list(group, None, filter, search, page, offset)

        folder = curation_models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return self.get_theme_list(group, folder, filter, search, page, offset)

    def get_theme_list(self, group, folder, filter, search, page, offset):
        if filter == "registered":
            return self.get_filter_register(group, folder, search, page, offset)
        elif filter == "unregistered":
            return self.get_filter_unregister(group, folder, search, page, offset)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def get_filter_register(self, group, folder, search, page, offset):
        tls = models.ThemeList.objects.filter(
            group=group,
            folder=folder,
            theme__title__icontains=search,
        ).order_by("-order")

        paginator = Paginator(tls, offset)

        try:
            serializer = serializers.ThemeInThemeListSerializer(
                paginator.page(page), many=True
            )
            return Response({"items": serializer.data}, status=status.HTTP_200_OK)
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def get_filter_unregister(self, group, folder, search, page, offset):
        tls = models.ThemeList.objects.filter(
            group=group,
            folder=folder,
        )
        theme_ids = [tl.theme.id for tl in tls]

        themes = theme_models.Theme.objects.filter(
            ~Q(id__in=theme_ids),
            title__icontains=search,
        )

        paginator = Paginator(themes, offset)

        try:
            serializer = serializers.ThemeSerializer(paginator.page(page), many=True)
            return Response({"items": serializer.data}, status=status.HTTP_200_OK)
        except EmptyPage:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        serializer = serializers.ThemeListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"item": serializer.data}, status=status.HTTP_201_CREATED)

        pprint.pprint(serializer.errors)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request):
        ids = [item["id"] for item in request.data]
        themeLists = models.ThemeList.objects.filter(id__in=ids)

        serializer = serializers.ThemeListOrderSerializer(
            themeLists, data=request.data, many=True
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
            status=status.HTTP_200_OK,
        )


class ThemeListDetail(APIView):
    permission_classes = (IsEditor,)

    def delete(self, request, list_id):
        li = models.ThemeList.objects.get_or_none(id=list_id)
        if li is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.ThemeListSerializer(li).data
        li.delete()
        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )
