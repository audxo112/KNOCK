import pprint
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from curations import models as curation_models
from themes import models as theme_models
from . import models, serializers


class ThemeList(APIView):
    def get(self, request):
        group_id = request.GET.get("group_id", "")
        folder_id = request.GET.get("folder_id", "")
        search = request.GET.get("search", "")
        filter = request.GET.get("filter", "registered")

        group = curation_models.ThemeCurationGroup.objects.get_or_none(id=group_id)
        if group is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        if group.view_type == curation_models.ThemeCurationGroup.VIEW_TYPE_LIST:
            return self.get_theme_list(group, None, filter, search)

        folder = curation_models.ThemeCurationFolder.objects.get_or_none(id=folder_id)
        if folder is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return self.get_theme_list(group, folder, filter, search)

    def get_theme_list(self, group, folder, filter, search):
        if filter == "registered":
            return self.get_filter_register(group, folder, search)
        elif filter == "unregistered":
            return self.get_filter_unregister(group, folder, search)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def get_filter_register(self, group, folder, search):
        tls = models.ThemeList.objects.filter(
            group=group,
            folder=folder,
            theme__title__icontains=search,
        ).order_by("-order")

        serializer = serializers.ThemeInThemeListSerializer(tls, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def get_filter_unregister(self, group, folder, search):
        tls = models.ThemeList.objects.filter(
            group=group,
            folder=folder,
        )
        theme_ids = [tl.theme.id for tl in tls]

        themes = theme_models.Theme.objects.filter(
            ~Q(id__in=theme_ids),
            title__icontains=search,
        )

        serializer = serializers.ThemeSerializer(themes, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = serializers.ThemeListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

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
                serializer.data,
                status=status.HTTP_200_OK,
            )

        pprint.pprint(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_200_OK,
        )


class ThemeListDetail(APIView):
    def delete(self, request, list_id):
        li = models.ThemeList.objects.get_or_none(id=list_id)
        if li is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.ThemeListSerializer(li).data
        li.delete()
        return Response(
            data,
            status=status.HTTP_200_OK,
        )
