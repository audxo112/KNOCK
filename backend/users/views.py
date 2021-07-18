import pprint
import requests
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers

from api import jwt
from api.permissions import IsEditor, IsOneselfOrEditor


def googleAuth(token):
    payload = {"access_token": token}
    r = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", params=payload)
    data = json.loads(r.text)

    if "error" in data:
        return data, Response(data["error"]["message"], status=data["error"]["code"])

    return data, None


# 앱에서 로그인 하는 유저가 사용
class GoogleLogin(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        data, error = googleAuth(request.data.get("access_token"))
        if error:
            return error

        serializer = jwt.GoogleJSONSerializer(data=data)

        if serializer.is_valid():
            user = serializer.object.get("user") or request.user
            token = serializer.object.get("token")
            return jwt.jwt_response(token, user, request)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 에디터에서 로그인 하는 유저가 사용
class GoogleLoginInEditor(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        data, error = googleAuth(request.data.get("access_token"))
        if error:
            return error

        serializer = jwt.GoogleJSONSerializer(data=data)

        if serializer.is_valid():
            user = serializer.object.get("user")
            if not user.is_editor:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            token = serializer.object.get("token")
            return jwt.jwt_response(token, user, request)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditorUserListInEditor(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        users = models.User.objects.filter(is_editor=True).order_by("order")
        serializer = serializers.UserSerializer(users, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        data = json.loads(request.data.get("data"))

        serializer = serializers.UserSerializer(
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
        users = models.User.objects.filter(id__in=ids)

        serializer = serializers.UserOrderSerializer(
            users, data=request.data, many=True
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


# 앱에서 특정 유저 정보 가져올때 사용
class UserDetail(APIView):
    permission_classes = (AllowAny,)

    # 임시 구현
    def get(self, request, user_id):
        user = models.User.objects.get(id=id)
        serializer = serializers.UserSerializer(user)
        return Response(
            {"item": serializer.data},
            status=status.HTTP_200_OK,
        )


class EditUserDetail(APIView):
    permission_classes = (IsOneselfOrEditor,)

    def put(self, request, user_id):
        user = models.User.objects.get_or_none(id=user_id)
        if user is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = json.loads(request.data.get("data"))

        serializer = serializers.UserSerializer(
            user,
            data=data,
            files=request.FILES,
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

    def delete(self, request, user_id):
        user = models.User.objects.get_or_none(id=user_id)
        if user is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        data = serializers.UserSerializer(user).data
        user.delete()

        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )


class SearchWithNameOrEmail(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, search):
        users = models.User.objects.filter(
            Q(nickname__icontains=search) | Q(email__icontains=search)
        )
        serializer = serializers.UserSerializer(users, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )


class CheckNickname(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, nickname):
        value = nickname.lower()

        if models.User.objects.filter(nickname_value=value).exists():
            return Response(
                {"code": 401, "message": "중복된 이름이 있습니다."}, status=status.HTTP_200_OK
            )
        if models.BanNickname.objects.filter(value=value).exists():
            return Response(
                {"code": 402, "message": "금지된 이름입니다."}, status=status.HTTP_200_OK
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class CheckBanNickname(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        q_list = Q()
        for q in [Q(value=nickname) for nickname in request.data]:
            q_list |= q
        bans = models.BanNickname.objects.filter(q_list)

        if bans.exists():
            serializer = serializers.BanNicknameSerializer(bans, many=True)
            return Response(
                {"items": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class BanNickname(APIView):
    permission_classes = (IsEditor,)

    def get(self, request):
        bans = models.BanNickname.objects.all().order_by("nickname")
        serializer = serializers.BanNicknameSerializer(bans, many=True)
        return Response(
            {"items": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = serializers.BanNicknameSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"item": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class BanNicknameDelete(APIView):
    permission_classes = (IsEditor,)

    def delete(self, request, user_id):
        ban = models.BanNickname.objects.get_or_none(id=user_id)
        if ban is None:
            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        data = serializers.BanNicknameSerializer(ban).data
        ban.delete()
        return Response(
            {"item": data},
            status=status.HTTP_200_OK,
        )
