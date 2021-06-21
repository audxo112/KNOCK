import React, { Component } from "react";
import styles from "./UserSelector.scss";
import classNames from "classnames/bind";
import { List } from "immutable";
import Label from "components/Label";
import { DEBUG } from "const/core";

const cx = classNames.bind(styles);

const getImage = (resource, updated = new Date()) => {
    if (resource && resource.image !== null && resource.image !== "") {
        const image = resource.image
        const imageChecker = image.split("base64").length
        var url = ""
        if (imageChecker > 1)
            url = image
        else if (imageChecker === 1)
            url = `${image}?${updated}`

        return url
    }
    return ""
}

const getAvatar = (item) => {
    if (item === null)
        return ""

    const {
        default_avatar,
        mini_avatar,
        micro_avatar
    } = item

    var image = getImage(micro_avatar, item.updated)
    if (image === "") {
        image = getImage(mini_avatar, item.updated)
    }
    if (image === "") {
        image = getImage(default_avatar, item.updated)
    }
    return image
}

class UserItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            nickname: "",
            micro_avatar: null,
            updated: new Date(),
        },
        selected: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        }
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    render() {
        const { item, selected } = this.props
        const avatar = getAvatar(item)

        return (
            <div
                className={cx("user-selector-item",
                    (selected ? "selected" : ""))}
                onClick={this.handleOnSelected}>
                <div className={cx("avatar-wrap")}>
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
                    {item.nickname}
                </div>
            </div>
        )
    }
}

class UserSelector extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: null,
        placeholder: "",
        enable: true,
        items: List([]),

        onSelected: (item) => {
            console.log(`onSelected is not implements : (${item})`)
        }
    }

    state = {
        is_open: false,
    }

    openIcon = {
        open: "/icon/ic_expand_less.svg",
        close: "/icon/ic_expand_more.svg"
    }

    wrapRef = React.createRef()

    handleToggleOpen = () => {
        if (!this.props.enable) return
        if (this.props.items.size === 0) return

        this.setState({
            is_open: !this.state.is_open
        })
    }

    handleOnSelect = (item) => {
        if (!this.props.enable) return

        const { onSelected } = this.props
        this.setState({
            is_open: false
        })
        onSelected(item)
    }

    _renderLabel() {
        const { label, labelStyle, enable } = this.props;
        if (label === "")
            return null

        return (<Label
            enable={enable}
            labelStyle={labelStyle}>
            {label}
        </Label>)
    }


    _renderList() {
        if (!this.state.is_open)
            return null;

        const { value, items } = this.props;
        const selectedId = value !== null ? value.id : ""
        const list = items.map(item => {
            return <UserItem
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onSelected={this.handleOnSelect} />
        })
        return (
            <div className={cx("user-selector-list-wrap")}>
                <div className={cx("user-selector-list")}>
                    {list}
                </div>
            </div>
        )
    }

    outsideClickListener = (e) => {
        if (!this.state.is_open) return;

        const wrap = this.wrapRef.current
        if (wrap && !wrap.contains(e.target)) {
            this.setState({
                is_open: false
            })
        }
    }

    componentDidMount() {
        document.addEventListener("click", this.outsideClickListener)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.outsideClickListener)
    }

    render() {
        const { value, placeholder, enable } = this.props
        const { is_open } = this.state
        const cIcon = is_open ? this.openIcon.open : this.openIcon.close
        const avatar = getAvatar(value)

        return (
            <div className={cx("user-selector-wrap",
                (!enable ? "disable" : ""))}
                ref={this.wrapRef}>
                {this._renderLabel()}
                <div className={cx("user-selector-wrap")}>
                    <div className={cx(
                        "user-selector-current",
                        (is_open ? "open" : ""))}
                        onClick={this.handleToggleOpen}>
                        <div className={cx("avatar-wrap")}>
                            {avatar === "" ? (
                                <div className={cx("avatar-default")} />
                            ) : (
                                <img
                                    className={cx("avatar")}
                                    alt="아바타"
                                    src={avatar} />
                            )}
                        </div>

                        <div className={cx(
                            "user-nickname",
                            (value === null ? "placeholder" : ""))}>
                            {value === null ? placeholder : value.nickname}
                        </div>

                        <img
                            className={cx("user-selector-open-icon")}
                            src={cIcon}
                            alt="open_icon" />
                    </div>
                    {this._renderList()}
                </div>
            </div>
        )
    }
}

export default UserSelector;