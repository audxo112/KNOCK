export const nav = {
    mains: [
        {
            name: "theme",
            isActive: true,
            to: "/theme/upload",
            label: "테마"
        },
        {
            name: "frame",
            isActive: true,
            to: "/frame/upload",
            label: "프레임"
        },
        {
            name: "curation",
            isActive: true,
            to: "/curation/group/upload",
            label: "큐레이션"
        },
        {
            name: "report",
            isActive: true,
            to: "/report/user",
            label: "신고관리"
        },
        {
            name: "popularity",
            to: "/popularity",
            label: "인기순위"
        },
    ],
    subs: {
        theme: [
            {
                label: "업로드",
                to: "/theme/upload"
            },
            {
                label: "목록",
                to: "/theme/list"
            },
        ],
        frame: [
            {
                label: "업로드",
                to: "/frame/upload"
            },
            {
                label: "목록",
                to: "/frame/list"
            }
        ],
        curation: [
            {
                label: "그룹추가",
                to: "/curation/group/upload"
            },
            {
                label: "그룹 수정/삭제",
                to: "/curation/group/edit"
            },
            {
                label: "폴더추가",
                to: "/curation/folder/upload"
            },
            {
                label: "폴더 수정/삭제",
                to: "/curation/folder/edit"
            },
            {
                label: "배경화면 추가",
                to: "/curation/theme/upload"
            },
            {
                label: "배경화면 수정/삭제",
                to: "/curation/theme/edit"
            },
        ],
        report: [
            {
                label: "유저",
                to: "/report/user"
            },
            {
                label: "배경화면",
                to: "/report/theme"
            }
        ],
        user: [
            {
                label: "계정 등록",
                to: "/user/register"
            },
            {
                label: "계정 수정",
                to: "/user/edit"
            },
            {
                label: "가입금지 아이디",
                to: "/user/ban-nickname"
            }
        ]
    }
}

export const user = {
    name: "user",
    isActive: true,
    to: "/user/register",
    label: "계정등록"
}