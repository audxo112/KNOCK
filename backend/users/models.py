from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from core import models as core_models
from . import managers


class Avatar(core_models.FleetThumbnailModels):
    user = models.ForeignKey(
        "users.User",
        related_name="avatars",
        on_delete=models.CASCADE,
        verbose_name=_("유저"),
    )

    objects = managers.AvatarManager()

    class Meta:
        verbose_name = _("유저 프로필 사진")
        verbose_name_plural = _("유저 프로필 사진")

    def __str__(self):
        return f"{self.user.nickname}의 아바타"

    def get_dir(self):
        return f"{self.user.get_dir()}/avatar/{self.image_size_type}"


class BanNickname(core_models.FleetModels):
    value = models.CharField(
        _("닉네임 값"),
        unique=True,
        max_length=16,
        help_text=_("닉네임을 소문자로 변환한 값"),
        default="",
    )

    nickname = models.CharField(
        _("닉네임"),
        unique=True,
        max_length=16,
    )

    class Meta:
        verbose_name = _("금지 닉네임")
        verbose_name_plural = _("금지 닉네임")

    def __str__(self):
        return f"{self.nickname}"

    def save(self, *args, **kwargs):
        nickname = kwargs.pop("nickname", self.nickname)
        self.value = nickname.lower()
        super(BanNickname, self).save(*args, **kwargs)


class User(core_models.FleetUserModels):
    GRADE_NORMAL = "normal"
    GRADE_BUSINESS = "business"
    GRADE_ARTIST = "artist"

    GRADE_CHOICES = (
        (GRADE_NORMAL, _("일반")),
        (GRADE_BUSINESS, _("기업")),
        (GRADE_ARTIST, _("아티스트")),
    )

    LOGIN_METHOD_NONE = "none"
    LOGIN_METHOD_GOOGLE = "google"

    LOGIN_METHOD_CHOICES = (
        (LOGIN_METHOD_NONE, "없음"),
        (LOGIN_METHOD_GOOGLE, "구글"),
    )

    grade = models.CharField(
        _("등급"),
        choices=GRADE_CHOICES,
        max_length=10,
        default=GRADE_NORMAL,
    )

    order = models.PositiveIntegerField(
        _("순서"),
        default=1,
    )

    is_verified = models.BooleanField(
        _("검증 여부"),
        default=False,
        help_text=_("에디터가 검증한 여부, 에디터에서 만든 유저는 기본값 True"),
    )

    is_editor = models.BooleanField(
        _("에디터"),
        default=False,
        help_text=_("에디터 인지 여부, 기본값 False"),
    )

    is_usable_editor = models.BooleanField(
        _("에디터사용"),
        default=False,
        help_text=_("에디터를 사용가능한지 여부, 기본값 False"),
    )

    is_visibility = models.BooleanField(
        _("컨텐츠 노출 여부"),
        default=True,
        help_text=_("해당 유저 관련 정보의 노출 여부, 기본값 True"),
    )

    upload_stop_period = models.DateTimeField(
        _("업로드 정지 기한"),
        default=timezone.now,
    )

    fcm_token = models.CharField(
        _("FCM 토큰"),
        max_length=256,
        blank=True,
        default="",
    )

    login_token = models.CharField(
        _("로그인 토큰"),
        max_length=16,
        default="",
        help_text=_("사용자 강제 로그아웃을 위해 필요"),
    )

    login_method = models.CharField(
        _("로그인 방식"),
        choices=LOGIN_METHOD_CHOICES,
        max_length=20,
        default=LOGIN_METHOD_NONE,
    )

    objects = managers.UserManager()

    class Meta:
        verbose_name = _("유저")
        verbose_name_plural = _("유저")

    def __str__(self):
        return f"{self.nickname}"

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                top = User.objects.order_by("-order")[0]
                self.order = top.order + 1
            except IndexError:
                self.order = 1

        if BanNickname.objects.filter(value=self.nickname_value).exists():
            raise ValueError("금지 이름에 존재 합니다.")

        super(User, self).save(*args, **kwargs)


class LikeTheme(core_models.FleetModels):
    user = models.ForeignKey(
        "users.User",
        related_name="like_themes",
        on_delete=models.CASCADE,
        verbose_name=_("좋아요 한 유저"),
    )
    theme = models.ForeignKey(
        "themes.Theme",
        related_name="likes",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )
    theme_owner = models.ForeignKey(
        "users.User",
        related_name="received_like_themes",
        on_delete=models.CASCADE,
        verbose_name=_("테마 제작자"),
    )

    class Meta:
        verbose_name = _("좋아요한 테마")
        verbose_name_plural = _("좋아요한 테마")


class AcquiredTheme(core_models.FleetModels):
    owner = models.ForeignKey(
        "users.User",
        related_name="acquired_themes",
        on_delete=models.CASCADE,
        verbose_name=_("소유자"),
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="acquired_themes",
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_("테마"),
    )

    is_fixed_term = models.BooleanField(
        _("기간제 여부"),
        default=False,
        help_text=_("사용기간이 정해져있는지 여부"),
    )

    expiration_date = models.DateTimeField(
        _("만료일"),
        default=core_models.default_end_date,
    )

    class Meta:
        verbose_name = _("획득한 테마")
        verbose_name_plural = _("획득한 테마")

    def __str__(self):
        return f"{self.owner.username}가 획득한 {self.theme.title}"


class ReportedTheme(core_models.FleetModels):
    reporter = models.ForeignKey(
        "users.User",
        related_name="report_themes",
        on_delete=models.CASCADE,
        verbose_name=_("신고자"),
    )

    reported_user = models.ForeignKey(
        "users.User",
        related_name="reported_themes",
        on_delete=models.CASCADE,
        verbose_name=_("신고된 유저"),
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="reported_themes",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    report_type = models.CharField(_("신고 유형"), max_length=30)

    report = models.CharField(_("신고 내용"), max_length=300)

    class Meta:
        verbose_name = _("테마 신고")
        verbose_name_plural = _("테마 신고")


class SharedTheme(core_models.FleetModels):
    SHARE_STATE_ALLOW = "allow"
    SHARE_STATE_HOLDING = "holding"
    SHARE_STATE_DENIED = "denied"

    SHARE_STATE_CHOICES = (
        (SHARE_STATE_ALLOW, _("허용")),
        (SHARE_STATE_HOLDING, _("보류중")),
        (SHARE_STATE_DENIED, _("거절됨")),
    )

    owner = models.ForeignKey(
        "users.User",
        related_name="shared_themes",
        on_delete=models.CASCADE,
        verbose_name=_("공유자"),
    )

    theme = models.ForeignKey(
        "themes.Theme",
        related_name="shread_themes",
        on_delete=models.CASCADE,
        verbose_name=_("테마"),
    )

    state = models.CharField(
        _("공유상태"),
        max_length=10,
        choices=SHARE_STATE_CHOICES,
        default=SHARE_STATE_ALLOW,
    )

    class Meta:
        verbose_name = _("테마 공유정보")
        verbose_name_plural = _("테마 공유정보")


class UserNotification(core_models.FleetModels):

    title = models.CharField(_("제목"), max_length=40)
    content = models.CharField(_("내용"), max_length=255)
    # data_sets = models.JSONField(
    #     _("데이터셋"),
    #     blank=True,
    #     help_text=_("Json 형식의 데이터 저장"),
    # )

    user = models.ForeignKey(
        "users.User",
        related_name="notifications",
        on_delete=models.CASCADE,
        verbose_name=_("유저"),
    )

    class Meta:
        verbose_name = _("알림")
        verbose_name_plural = _("알림")
