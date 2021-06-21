import React, { Component } from "react"
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
        onClick: (item) => {
            if (DEBUG)
                console.log("onClick is not implements", item)
        }
    }

    handleOnClick = () => {
        const { item, onClick } = this.props
        onClick(item)
    }

    getImage = (resource, updated = new Date()) => {
        if (resource && resource.image !== null && resource.image !== "") {
            const image = resource.image
            const imageChecker = image.split("base64").length

            var url = ""
            if (imageChecker > 1)
                url = image
            else if (imageChecker === 1) {
                var urlEnd
                if (updated.getTime)
                    urlEnd = updated.getTime()
                else {
                    urlEnd = new Date(updated).getTime()
                }
                url = `${image}?${urlEnd}`
            }

            return url
        }
        return ""
    }

    getUserAvatar = (item) => {
        if (!item)
            return ""

        const {
            default_avatar,
            mini_avatar,
            micro_avatar
        } = item

        var image = this.getImage(micro_avatar, item.updated)
        if (image === "") {
            image = this.getImage(mini_avatar, item.updated)
        }
        if (image === "") {
            image = this.getImage(default_avatar, item.updated)
        }
        return image
    }

    getThumbnail = (item) => {
        if (!item)
            return ""

        const {
            default_thumbnail,
        } = item

        return this.getImage(default_thumbnail, item.updated)
    }

    renderThumbnail() {
        const { item } = this.props
        const thumbnail = this.getThumbnail(item)
        var contentTypeIcon = ""
        if (item.content_type.indexOf("image") !== -1) {
            contentTypeIcon = "/icon/ic_contents_type_image.svg"
        }
        else if (item.content_type.indexOf("video") !== -1) {
            contentTypeIcon = "/icon/ic_contents_type_video.svg"
        }

        return (
            <div className={cx("thumbnail-wrap")}
                onClick={this.handleOnClick}>
                <img
                    className={cx("thumbnail")}
                    alt="썸네일"
                    src={thumbnail} />
                <div className={cx("shadow")}></div>
                {contentTypeIcon !== "" && (
                    <img
                        className={cx("content-icon")}
                        alt="컨텐츠아이콘"
                        src={contentTypeIcon} />
                )}
            </div>
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
        const avatar = this.getUserAvatar(owner)

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
        const { lastRef, header, items, onClick } = this.props
        const { isOpen } = this.state

        const list = items.map((item, index) => {
            const isLast = index === items.size - 1
            return (
                <ThemeItem
                    innerRef={isLast ? lastRef : null}
                    key={item.id}
                    item={item}
                    onClick={onClick} />
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
        onClick: (item) => {
            if (DEBUG)
                console.log("onClick is not implements", item)
        }
    }

    render() {
        const { lastRef, header, items, onClick } = this.props

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
                    onClick={onClick} />
            )
        })

        return <div className={cx("theme-list-wrap")}>
            {list}
        </div>
    }
}

export default ThemeList