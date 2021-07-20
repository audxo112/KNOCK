import React, { Component } from "react"
import { ContextMenu, MenuItem, ContextMenuTrigger, hideMenu } from "react-contextmenu";
import styles from "./ThemeList.scss"
import classNames from "classnames/bind"
import { DEBUG } from "const/core"
import { List, Map } from "immutable"

const cx = classNames.bind(styles)

class ThemeItem extends Component {
    static defaultProps = {
        innerRef: null,
        item: {
            id: "",
            title: "",
            owner: null,
            content_type: "",
            default_thumbnail: null,
            mini_thumbnail: null,
            updated: new Date(),
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
        if (!item)
            return ""

        const {
            default_thumbnail,
        } = item

        return this.getImage(default_thumbnail)
    }

    getContentTypeIcon = () => {
        const { content_type: ct } = this.props.item

        if (ct.indexOf("image") !== -1) return "/icon/ic_contents_type_image.svg"
        else if (ct.indexOf("video") !== -1) return "/icon/ic_contents_type_video.svg"

        return ""
    }

    renderThumbnail() {
        const { item, selected } = this.props


        return (<>
            <ContextMenuTrigger id={item.id}>
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
        </>
        )
    }

    renderThemeInfo() {
        const { item } = this.props

        return (
            <div className={cx("theme-title")}>
                {item.title}
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
        const { innerRef } = this.props
        return (
            <div
                ref={innerRef}
                className={cx("theme-item-wrap")}>
                {this.renderThumbnail()}
                {this.renderThemeInfo()}
                {this.renderUser()}
            </div>
        )
    }
}

class ThemeItems extends Component {
    static defaultProps = {
        lastRef: null,
        header: "",
        items: List(),
        onClick: (item) => {
            if (DEBUG)
                console.log("onClick is not implements", item)
        }
    }

    state = {
        isOpen: true
    }

    handleToogleOpen = () => {
        const { isOpen } = this.state
        this.setState({
            isOpen: !isOpen
        })
    }

    render() {
        const { lastRef, header, items, selected, onClick, onDoubleClick, onMenuShow, onUpdate, onDelete } = this.props
        const { isOpen } = this.state
        const selected_id = selected ? selected.id : null

        const list = items.map((item, index) => {
            const isLast = index === items.size - 1
            return (
                <ThemeItem
                    innerRef={isLast ? lastRef : null}
                    key={item.id}
                    item={item}
                    selected={item.id === selected_id}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    onMenuShow={onMenuShow}
                    onUpdate={onUpdate}
                    onDelete={onDelete} />
            )
        })

        const count = items.size ? items.size : items.length ? items.length : 0
        const headerText = `${header} (${count}개)`
        const headerToogle = (
            isOpen ?
                "/icon/ic_expand_less.svg" :
                "/icon/ic_expand_more.svg"
        )

        return (
            <div
                className={cx("theme-items-wrap")}
                key={header}>
                <div className={cx("header-wrap")}>
                    <div className={cx("header-text")}>
                        {headerText}
                    </div>
                    <div className={cx("open-icon")}
                        onClick={this.handleToogleOpen}>
                        <img
                            className={cx("items-toggle")}
                            alt="리스트토글"
                            src={headerToogle} />
                    </div>
                </div>
                <div className={cx("divider")} />
                {isOpen && (
                    <div className={cx("theme-items")}>
                        {list}
                    </div>
                )}
            </div>
        )
    }
}

class ThemeList extends Component {
    static defaultProps = {
        lastRef: null,
        header: [],
        items: Map(),
        selected: null,
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
    }

    render() {
        const { lastRef, header, items, selected, onOutClick, onClick, onDoubleClick, onMenuShow, onUpdate, onDelete } = this.props

        const today = new Date().toISOString().substring(0, 10)
        const list = header.map((key, index) => {
            const date = today === key ? "오늘" : key
            const isLast = index === header.length - 1
            return (
                <ThemeItems
                    lastRef={isLast ? lastRef : null}
                    key={key}
                    header={date}
                    items={items.get(key)}
                    selected={selected}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    onMenuShow={onMenuShow}
                    onUpdate={onUpdate}
                    onDelete={onDelete} />
            )
        })

        return <div className={cx("theme-list-wrap")}
            onClick={onOutClick}>
            {list}
        </div>
    }
}

export default ThemeList