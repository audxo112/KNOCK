import jwt

from django.utils import timezone
from django.utils.translation import ugettext as _

from calendar import timegm
from datetime import datetime, timedelta

from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

from users.models import User

jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER


def jwt_payload_handler(user):
    payload = {
        "username": user.username,
        "login_token": user.login_token,
        "exp": datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA,
    }

    if api_settings.JWT_ALLOW_REFRESH:
        payload["orig_iat"] = timegm(datetime.utcnow().utctimetuple())

    if api_settings.JWT_AUDIENCE is not None:
        payload["aud"] = api_settings.JWT_AUDIENCE

    if api_settings.JWT_ISSUER is not None:
        payload["iss"] = api_settings.JWT_ISSUER

    return payload


def jwt_response_payload_handler(token, user=None, request=None):
    if user is not None:
        user.last_login = timezone.now()
        user.save()
    return {
        "token": token,
    }


def jwt_create_token(user):
    payload = jwt_payload_handler(user)
    return jwt_encode_handler(payload)


class Serializer(serializers.Serializer):
    @property
    def object(self):
        return self.validated_data


class JWTBaseSerializer(Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        msg = "validate is not implements"
        raise NotImplementedError(msg)

    def _check_payload(self, token):

        try:
            payload = jwt_decode_handler(token)
        except jwt.ExpiredSignature:
            msg = _("Signature has expired.")
            raise serializers.ValidationError(msg)
        except jwt.DecodeError:
            msg = _("Error decoding signature.")
            raise serializers.ValidationError(msg)

        return payload

    def _check_user(self, payload):
        username = payload.get("username")

        if not username:
            msg = _("Invalid payload.")
            raise serializers.ValidationError(msg)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            msg = _("User doesn't exist.")
            raise serializers.ValidationError(msg)

        if not user.is_active:
            msg = _("User account is disabled.")
            raise serializers.ValidationError(msg)

        if user.login_token != payload.get("login_token"):
            msg = _("Invalid user info")
            raise serializers.ValidationError(msg)

        return user


class GoogleJSONSerializer(Serializer):
    id = serializers.CharField(required=False)
    email = serializers.CharField(required=False)

    class Meta:
        fields = ("id", "email")

    def validate(self, attrs):
        try:
            user = User.objects.get(username=attrs["id"])
        except User.DoesNotExist:
            user = User.objects.create_social_user(
                username=attrs["id"],
                email=attrs["email"],
                login_method=User.LOGIN_METHOD_GOOGLE,
            )

        token = jwt_create_token(user)

        return {
            "token": token,
            "user": user,
        }


class VerifyJWTSerializer(JWTBaseSerializer):
    def validate(self, attrs):
        token = attrs["token"]

        payload = self._check_payload(token)
        user = self._check_user(payload)

        if api_settings.JWT_ALLOW_REFRESH:
            payload["orig_iat"] = timegm(datetime.utcnow().utctimetuple())

        return {
            "token": jwt_encode_handler(payload),
            "user": user,
        }


class RefreshJWTSerializer(JWTBaseSerializer):
    def validate(self, attrs):
        token = attrs["token"]

        payload = self._check_payload(token)
        user = self._check_user(payload)

        orig_iat = payload.get("orig_iat")

        if not orig_iat:
            msg = _("Not allow refresh")
            raise serializers.ValidationError(msg)

        refresh_limit = api_settings.JWT_REFRESH_EXPIRATION_DELTA
        if isinstance(refresh_limit, timedelta):
            refresh_limit = refresh_limit.days * 24 * 3600 + refresh_limit.seconds

        expiration_timestamp = orig_iat + int(refresh_limit)
        now_timestamp = timegm(datetime.utcnow().utctimetuple())

        if now_timestamp > expiration_timestamp:
            msg = _("Refresh has expired.")
            raise serializers.ValidationError(msg)

        new_payload = jwt_payload_handler(user)
        new_payload["orig_iat"] = orig_iat

        return {
            "token": jwt_encode_handler(new_payload),
            "user": user,
        }
