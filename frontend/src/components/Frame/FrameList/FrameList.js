import React, { Component } from "react"
import { ContextMenu, MenuItem, ContextMenuTrigger, hideMenu } from "react-contextmenu";
import styles from "./FrameList.scss"
import classNames from "classnames/bind"
import { List } from "immutable";
import { DEBUG } from "const/core"
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arraysEqual, deepEqual } from "utils/equals";

const cx = classNames.bind(styles)

class FrameItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            user: null,
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
        return !deepEqual(nextProps.item, this.props.item) ||
            nextProps.selected !== this.props.selected
    }

    handleOnClick = (e) => {
        e.stopPropagation();

        const { item, onClick } = this.props
        onClick(item)
        hideMenu()
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
        e.stopPropagation();
        const { item, onUpdate } = this.props
        onUpdate(item)
    }

    handleOnDelete = (e) => {
        e.stopPropagation();
        const { item, onDelete } = this.props
        onDelete(item)
    }

    getImage = (res) => {
        if (
            !res ||
            !res.image ||
            res.image === ""
        ) return ""

        const { image, updated } = res
        const imageChecker = image.split("base64").length

        if (imageChecker > 1) return image
        else if (imageChecker === 1) {
            var urlEnd = updated.getTime ?
                updated.getTime() :
                new Date(updated).getTime()
            return `${image}?${urlEnd}`
        }

        return ""
    }

    getUserAvatar = () => {
        const { user } = this.props.item
        if (!user) return ""

        const {
            default_avatar,
            mini_avatar,
            micro_avatar
        } = user

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

    renderThumbnail() {
        const { item, selected } = this.props
        return (<>
            <ContextMenuTrigger id={item.id}>
                <div
                    className={cx("thumbnail-wrap")}
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
                </div>
            </ContextMenuTrigger>

            <ContextMenu
                id={item.id}
                onShow={this.handleOnMenuShow}>
                <MenuItem
                    data={item}
                    onClick={this.handleOnUpdate}>
                    <img className={cx("frame-contextmenu-icon")}
                        src="/icon/ic_edit_enable.svg"
                        alt="수정아이콘" />
                    <div className={cx("frame-contextmenu-text")}>수정하기</div>
                </MenuItem>
                <MenuItem
                    data={item}
                    onClick={this.handleOnDelete}>
                    <img className={cx("frame-contextmenu-icon")}
                        src="/icon/ic_delet_enable.svg"
                        alt="삭제아이콘" />
                    <div className={cx("frame-contextmenu-text")}>삭제하기</div>
                </MenuItem>
            </ContextMenu>
        </>)
    }

    renderFrameInfo() {
        const { title } = this.props.item
        return (
            <div className={cx("frame-title")}>
                {title}
            </div>
        )
    }

    renderUser() {
        const { user } = this.props.item
        const avatar = this.getUserAvatar(user)

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
                    {user.nickname}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={cx("frame-item-wrap")}>
                {this.renderThumbnail()}
                {this.renderFrameInfo()}
                {this.renderUser()}
            </div>
        )
    }
}

const SortableFrameItem = SortableElement(({ item, selected, onClick, onDoubleClick, onMenuShow, onUpdate, onDelete }) => {
    return <FrameItem
        key={item.id}
        item={item}
        selected={selected}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMenuShow={onMenuShow}
        onUpdate={onUpdate}
        onDelete={onDelete}
    />
})

const SortableFrameList = SortableContainer(({ items, selected, onClick, onDoubleClick, onMenuShow, onUpdate, onDelete }) => {
    const selected_id = selected ? selected.id : null
    const list = items.map((item, index) => {
        return (
            <SortableFrameItem
                key={item.id}
                index={index}
                item={item}
                selected={item.id === selected_id}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMenuShow={onMenuShow}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        )
    })
    return <div className={cx("list-wrap")}>
        {list}
    </div>
})

class FrameList extends Component {
    static defaultProps = {
        items: List(),
        selected: null,
        loading: false,
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
    }

    shouldComponentUpdate(nextProps) {
        return !arraysEqual(nextProps.items, this.props.items) ||
            nextProps.selected !== this.props.selected ||
            nextProps.loading !== this.props.loading
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
        const { loading, items, selected, onOutClick, onClick, onDoubleClick, onMenuShow, onUpdate, onDelete } = this.props

        return <div className={cx("frame-list-wrap")}
            onClick={onOutClick}>
            {loading ? (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")}>
                    </div>
                </div>
            ) : (
                <SortableFrameList
                    items={items}
                    axis="xy"
                    lockAxis="xy"
                    helperClass="dragging-frame"
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
            )}
        </div>
    }
}

export default FrameList;