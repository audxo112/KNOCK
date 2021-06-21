export const GROUP_LIST = "GroupList"
export const OLD_GROUP_LIST = "OldGroupList"

export const getScrollIcon = (view_type) => {
    if (view_type === "L_HorizontalScroll")
        return "/icon/ic_view_type_horizon_large_enabled.svg"
    else if (view_type === "M_HorizontalScroll")
        return "/icon/ic_view_type_horizon_medium_enabled.svg"
    else if (view_type === "S_HorizontalScroll")
        return "/icon/ic_view_type_horizon_small_enabled.svg"
    else if (view_type === "SquareAlbum")
        return "/icon/ic_view_type_horizon_album_enabled.svg"
    else if (view_type === "List")
        return "/icon/ic_view_type_vertical_enabled.svg"

    return ""
}
