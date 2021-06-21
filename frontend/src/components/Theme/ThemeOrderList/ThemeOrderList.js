import React, { Component } from "react"
import styles from "./ThemeOrderList.scss"
import classNames from "classnames/bind"
import { ContextMenu, MenuItem, ContextMenuTrigger, hideMenu } from "react-contextmenu";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { DEBUG } from "const/core"
import { FILTER_REGISTERED, FILTER_UNREGISTERED } from "./const"
import { arraysEqual, deepEqual } from "utils/equals";
import Tooltip from "components/Tooltip";
import CheckBox from "components/CheckBox";
import { VIEW_TYPE_LIST } from "const";

const cx = classNames.bind(styles)

class ThemeItem extends Component {
    static defaultProps = {
        enable_menu: false,
        item: {
            id: "",
            theme_id: "",
            owner: null,
            title: "",
            origin_thumbnail: null,
            default_thumbnail: null,
            mini_thumbnail: null,
            large_content: null,
            normal_content: null,
        },
        selected: false,
        onClick: (item) => {
            if (DEBUG)
                console.log("onClick is not implements", item)
        },
        onDoubleClick: (item) => {
            if (DEBUG)
                console.log("onDoubleClick is not implements", item)
        },
        onMenuShow: (item) => {
            if (DEBUG)
                console.log("onMenuShow is not implements", item)
        },
        onUpdate: (item) => {
            if (DEBUG)
                console.log("onUpdate is not implements", item)
        },
        onDelete: (item) => {
            if (DEBUG)
                console.log("onDelete is not implements", item)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.enable_menu !== this.props.enable_menu ||
            !deepEqual(nextProps.item, this.props.item) ||
            nextProps.selected !== this.props.selected
    }

    handleOnClick = (e) => {
        e.stopPropagation();

        const { enable_menu, item, onClick } = this.props
        onClick(item)

        if (enable_menu) {
            hideMenu()
        }
    }

    handleOnDoubleClick = (e) => {
        e.stopPropagation();

        const { item, onDoubleClick } = this.props
        onDoubleClick(item)
    }

    handleOnMenuShow = () => {
        const { item, onMenuShow } = this.props
        onMenuShow(item)
    }

    handleOnUpdate = (e) => {
        e.stopPropagation()
        const { item, onUpdate } = this.props
        onUpdate(item)
    }

    handleOnDelete = (e) => {
        e.stopPropagation()
        const { item, onDelete } = this.props
        onDelete(item)
    }

    getUrlEnd = () => {
        const { updated } = this.props.item
        if (updated.getTime) return `?${updated.getTime()}`
        else return `?${new Date(updated).getTime()}`
    }

    getImage = (res) => {
        if (
            !res ||
            !res.image ||
            res.image === ""
        ) return ""

        const { image } = res
        const imageChecker = image.split("base64").length
        if (imageChecker > 1) return image
        else if (imageChecker === 1) return `${image}?${this.getUrlEnd()}`

        return ""
    }

    getUserAvatar = () => {
        const { owner } = this.props.item
        if (!owner) return ""

        const {
            default_avatar,
            mini_avatar,
            micro_avatar
        } = owner

        var image = this.getImage(micro_avatar)
        if (image === "") {
            image = this.getImage(mini_avatar)
        }
        if (image === "") {
            image = this.getImage(default_avatar)
        }
        return image
    }

    getThumbnail = () => {
        const { item } = this.props
        if (!item) return ""

        const {
            default_thumbnail,
            mini_thumbnail
        } = item

        var image = this.getImage(default_thumbnail)
        if (image === "") {
            image = this.getImage(mini_thumbnail)
        }
        return image
    }

    getContentTypeIcon = () => {
        const { content_type: ct } = this.props.item

        if (ct.indexOf("gif") !== -1) return "/icon/ic_contents_type_gif.svg"
        else if (ct.indexOf("image") !== -1) return "/icon/ic_contents_type_image.svg"
        else if (ct.indexOf("video") !== -1) return "/icon/ic_contents_type_video.svg"

        return ""
    }

    haveCurations = () => {
        const { curations } = this.props.item
        return curations && curations.length > 0
    }

    renderInnerThumbnail() {
        const { selected } = this.props

        return (
            <div className={cx("thumbnail-wrap")}
                onClick={this.handleOnClick}
                onDoubleClick={this.handleOnDoubleClick}>
                <img
                    className={cx("thumbnail")}
                    alt="썸네일"
                    src={this.getThumbnail()} />
                <div className={cx("shadow")}></div>
                <img
                    className={cx("content-icon")}
                    alt="컨텐츠아이콘"
                    src={this.getContentTypeIcon()} />

                {selected && (
                    <div className={cx("selected")} />
                )}
                {this.haveCurations() && (
                    <Tooltip
                        content={this.renderTooltipContent()}>
                        <img
                            className={cx("have-curations")}
                            alt="큐레이션"
                            src="/icon/ic_contents_type_added_other_folder.svg" />
                    </Tooltip>
                )}
            </div>

        )
    }

    renderThumbnailWithContextMenu() {
        const {
            item,
            enable_menu_update,
            enable_menu_delete,
        } = this.props
        return (<>
            <ContextMenuTrigger id={item.theme_id}>
                {this.renderInnerThumbnail()}
            </ContextMenuTrigger>

            <ContextMenu
                id={item.theme_id}
                onShow={this.handleOnMenuShow}>
                {enable_menu_update && (
                    <MenuItem
                        data={item}
                        onClick={this.handleOnUpdate}>
                        <img className={cx("theme-contextmenu-icon")}
                            src="/icon/ic_edit_enable.svg"
                            alt="수정아이콘" />
                        <div className={cx("theme-contextmenu-text")}>수정하기</div>
                    </MenuItem>
                )}
                {enable_menu_delete && (
                    <MenuItem
                        data={item}
                        onClick={this.handleOnDelete}>
                        <img className={cx("theme-contextmenu-icon")}
                            src="/icon/ic_delet_enable.svg"
                            alt="삭제아이콘" />
                        <div className={cx("theme-contextmenu-text")}>삭제하기</div>
                    </MenuItem>
                )}
            </ContextMenu>
        </>)
    }

    renderTooltipContent() {
        const { curations } = this.props.item
        if (!this.haveCurations()) return null

        const list = curations.map((curation, index) => {
            const is_list = curation.group_view_type === VIEW_TYPE_LIST
            return <div
                key={is_list ? curation.group_id : curation.folder_id}
                className={cx("tooltip-curation-item")}>
                {is_list ?
                    `${index + 1}. ${curation.group_title}` :
                    `${index + 1}. ${curation.group_title} - ${curation.folder_title}`}
            </div>
        })

        return <div className={cx("tooltip-theme")}>
            <div className={cx("tooltip-header")}>
                다른 폴더에 등록된 배경화면
            </div>
            {list}
        </div>
    }

    renderThumbnail() {
        const { enable_menu } = this.props
        if (enable_menu) return this.renderThumbnailWithContextMenu()
        else return this.renderInnerThumbnail()
    }

    renderThemeInfo() {
        const { title } = this.props.item
        return (
            <div className={cx("theme-title")}>
                {title}
            </div>
        )
    }

    renderUser() {
        const { owner } = this.props.item
        const avatar = this.getUserAvatar()
        return (
            <div className={cx("user-wrap")}>
                <div className={cx("user-avatar-wrap")}>
                    {avatar === "" ? (
                        <div className={cx("avatar-default")} />
                    ) : (
                        <img
                            className={cx("avatar")}
                            alt="아바타"
                            src={avatar} />
                    )}
                </div>
                <div className={cx("user-nickname")}>
                    {owner.nickname}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={cx("theme-item-wrap")}>
                {this.renderThumbnail()}
                {this.renderThemeInfo()}
                {this.renderUser()}
            </div>
        )
    }
}

class ThemeList extends Component {
    handleOnCheckedFilter = (checked, value) => {
        const { filter, onChangeFilter } = this.props
        if (checked && value !== filter) {
            onChangeFilter(value)
        }
    }

    renderFilter() {
        const { show_filter, enable, filter } = this.props
        if (!show_filter) return null

        return (
            <div className={cx("filter-wrap")}>
                <CheckBox
                    enable={enable}
                    label="등록 테마"
                    value={FILTER_REGISTERED}
                    checked={filter === FILTER_REGISTERED}
                    onChecked={this.handleOnCheckedFilter} />
                <CheckBox
                    enable={enable}
                    label="미등록 테마"
                    value={FILTER_UNREGISTERED}
                    checked={filter === FILTER_UNREGISTERED}
                    onChecked={this.handleOnCheckedFilter} />
            </div>
        )
    }

    render() {
        const {
            enable_menu,
            enable_menu_update,
            enable_menu_delete,
            items,
            selected,
            onClick,
            onDoubleClick,
            onMenuShow,
            onUpdate,
            onDelete
        } = this.props
        var list = null
        if (items !== null) {
            list = items.map((item) => {
                return (
                    <ThemeItem
                        key={item.theme_id}
                        enable_menu={enable_menu}
                        enable_menu_update={enable_menu_update}
                        enable_menu_delete={enable_menu_delete}
                        item={item}
                        selected={item.theme_id === selected}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                        onMenuShow={onMenuShow}
                        onUpdate={onUpdate}
                        onDelete={onDelete} />)
            })
        }

        return (
            <div className={cx("list-wrap-out")}>
                {this.renderFilter()}
                <div className={cx("list-wrap")}>
                    {list}
                </div>
            </div>
        )
    }
}

const SortableThemeItem = SortableElement(({
    enable_menu,
    enable_menu_update,
    enable_menu_delete,
    item,
    selected,
    onClick,
    onDoubleClick,
    onMenuShow,
    onUpdate,
    onDelete
}) => {
    return (
        <ThemeItem
            key={item.theme_id}
            enable_menu={enable_menu}
            enable_menu_update={enable_menu_update}
            enable_menu_delete={enable_menu_delete}
            item={item}
            selected={selected}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMenuShow={onMenuShow}
            onUpdate={onUpdate}
            onDelete={onDelete} />
    )
})

const SortableThemeList = SortableContainer(({
    enable_menu,
    enable_menu_update,
    enable_menu_delete,
    items,
    selected,
    onClick,
    onDoubleClick,
    onMenuShow,
    onUpdate,
    onDelete
}) => {
    var list = null
    if (items !== null) {
        list = items.map((item, index) => {
            return (
                <SortableThemeItem
                    key={item.theme_id}
                    enable_menu={enable_menu}
                    enable_menu_update={enable_menu_update}
                    enable_menu_delete={enable_menu_delete}
                    index={index}
                    item={item}
                    selected={item.theme_id === selected}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    onMenuShow={onMenuShow}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            )
        })
    }



    return (
        <div className={cx("list-wrap")}>
            {list}
        </div>
    )
})

class ThemeOrderList extends Component {
    static defaultProps = {
        enable: true,
        enable_menu: false,
        enable_menu_update: true,
        enable_menu_delete: true,
        show_filter: true,
        filter: FILTER_REGISTERED,
        draggable: false,
        loading: false,
        items: [],
        selected: "",
        onOutClick: () => {
            if (DEBUG)
                console.log("onOutClick is not implements")
        },
        onClick: (item) => {
            if (DEBUG)
                console.log("onClick is not implements", item)
        },
        onDoubleClick: (item) => {
            if (DEBUG)
                console.log("onDoubleClick is not implements", item)
        },
        onMenuShow: (item) => {
            if (DEBUG)
                console.log("onMenuShow is not implements", item)
        },
        onUpdate: (item) => {
            if (DEBUG)
                console.log("onUpdate is not implements", item)
        },
        onDelete: (item) => {
            if (DEBUG)
                console.log("onDelete is not implements", item)
        },
        onSortEnd: (result) => {
            if (DEBUG)
                console.log("onSortEnd is not implements", result)
        },
        onChangeFilter: (filter) => {
            if (DEBUG)
                console.log("onChangeFilter is not implements", filter)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.enable !== this.props.enable ||
            nextProps.enable_menu !== this.props.enable_menu ||
            nextProps.loading !== this.props.loading ||
            !arraysEqual(nextProps.items, this.props.items) ||
            nextProps.selected !== this.props.selected ||
            nextProps.filter !== this.props.filter
    }

    handleOnSrotStart = () => {
        hideMenu()
    }

    handleOnSortEnd = ({ oldIndex, newIndex }) => {
        const { onSortEnd } = this.props

        onSortEnd({
            src: oldIndex,
            dst: newIndex,
        })
    }

    render() {
        const {
            enable,
            enable_menu,
            enable_menu_update,
            enable_menu_delete,
            show_filter, filter,
            draggable,
            loading,
            items,
            selected,
            onOutClick,
            onClick,
            onDoubleClick,
            onMenuShow,
            onUpdate,
            onDelete,
            onChangeFilter,
        } = this.props

        return (
            <div className={cx("theme-order-list-wrap")}
                onClick={onOutClick}>
                {loading ? (
                    <div className={cx("loading-wrap")}>
                        <div className={cx("loading-progress")}>
                        </div>
                    </div>
                ) : (
                    draggable ? (
                        <SortableThemeList
                            enable_menu={enable_menu}
                            enable_menu_update={enable_menu_update}
                            enable_menu_delete={enable_menu_delete}
                            items={items}
                            axis="xy"
                            helperClass="dragging-theme"
                            distance={1}
                            disableAutoscroll={true}
                            onSortStart={this.handleOnSrotStart}
                            onSortEnd={this.handleOnSortEnd}
                            selected={selected}
                            onClick={onClick}
                            onDoubleClick={onDoubleClick}
                            onMenuShow={onMenuShow}
                            onUpdate={onUpdate}
                            onDelete={onDelete} />
                    ) : (
                        <ThemeList
                            enable={enable}
                            enable_menu={enable_menu}
                            enable_menu_update={enable_menu_update}
                            enable_menu_delete={enable_menu_delete}
                            show_filter={show_filter}
                            filter={filter}
                            items={items}
                            selected={selected}
                            onClick={onClick}
                            onDoubleClick={onDoubleClick}
                            onMenuShow={onMenuShow}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onChangeFilter={onChangeFilter} />
                    )
                )}
            </div>
        )
    }
}

export default ThemeOrderList;
