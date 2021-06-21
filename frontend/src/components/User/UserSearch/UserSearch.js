import React, { Component } from "react";
import styles from "./UserSearch.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import { DEBUG } from "const/core";
import { List } from "immutable";

const cx = classNames.bind(styles);


class UserItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            nickname: "",
            email: "",
            default_avatar: null,
            mini_avatar: null,
            micro_avatar: null,
            is_usable_editor: false,
        },
        loading: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    getImage = (resource) => {
        if (resource && resource.image !== null && resource.image !== "") {
            return resource.image
        }
        return ""
    }

    getAvatar = () => {
        const {
            item: {
                default_avatar,
                mini_avatar,
                micro_avatar
            }
        } = this.props

        var image = this.getImage(micro_avatar)
        if (image === "") {
            image = this.getImage(mini_avatar)
        }
        if (image === "") {
            image = this.getImage(default_avatar)
        }
        return image
    }

    renderAvatar() {
        const avatar = this.getAvatar()
        if (avatar === "")
            return (
                <div className={cx("avatar-wrap")}>
                    <div className={cx("avatar-default")} />
                </div>
            )

        return (
            <div className={cx("avatar-wrap")}>
                <img
                    className={cx("avatar")}
                    src={avatar}
                    alt="프로필" />
            </div>
        )
    }

    renderInfo() {
        const { item } = this.props
        return (
            <div className={cx("info-wrap")}>
                <div className={cx("nickname")}>
                    {item.nickname}
                </div>
                <div className={cx("email")}>
                    {item.email}
                </div>
            </div>
        )
    }

    renderIsEditorIcon() {
        const { item, loading } = this.props
        if (loading) {
            return (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")}></div>
                </div>
            )
        }

        return (
            <div className={cx("is-editor-wrap")}>
                <img
                    className={cx("is-editor")}
                    src={
                        item.is_usable_editor ?
                            "/icon/ic_check_checked.svg" :
                            "/icon/ic_account_add_white.svg"
                    }
                    alt="에디터" />
            </div>
        )
    }

    render() {
        return (
            <div
                className={cx("user-item")}
                onClick={this.handleOnSelected}>
                {this.renderAvatar()}
                {this.renderInfo()}
                {this.renderIsEditorIcon()}
            </div>
        )
    }
}


class UserSearch extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        minLength: null,
        maxLength: null,
        placeholder: "",
        enable: true,
        loading: false,
        registering_id: "",
        showRemainText: false,
        users: List([]),
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implements", value)
        },
        onSearch: (value) => {
            if (DEBUG)
                console.log("onSearch is not implements", value)
        },
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
    }

    state = {
        is_open: false
    }

    wrapRef = React.createRef()

    handleOnFocus = () => {
        this.setState({
            is_open: true
        })
    }

    handleOutsideClick = (e) => {
        if (!this.state.is_open)
            return;

        const wrap = this.wrapRef.current
        if (wrap && !wrap.contains(e.target)) {
            this.setState({
                is_open: false
            })
        }
    }

    handleChangeInput = (e) => {
        const { value, maxLength } = e.target
        const { onChange } = this.props

        var text = value
        if (maxLength !== null &&
            text.length > maxLength) {
            text = text.substr(0, maxLength)
        }

        this.handleSearch(text)
        onChange(text)
    }

    loader = null

    handleSearch = (text) => {
        const { minLength, onSearch } = this.props
        if (this.loader !== null) {
            clearTimeout(this.loader)
        }

        if (minLength !== null &&
            minLength > text.length) {
            return;
        }

        this.loader = setTimeout(() => {
            onSearch(text)
        }, 100)
    }

    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleOutsideClick)
    }

    renderLabel() {
        const { label, labelStyle, enable } = this.props;
        if (label === "")
            return null

        return (
            <Label
                enable={enable}
                labelStyle={labelStyle}>
                {label}
            </Label>
        )
    }

    renderRemainText() {
        const { maxLength, showRemainText } = this.props;

        if (maxLength === null || !showRemainText)
            return null

        const { value, enable } = this.props
        const remainCount = maxLength - value.length

        return (
            <div className={cx("remain-text",
                (!enable ? "disable" : ""))}>
                {remainCount}자
            </div>
        )
    }

    renderSearchIcon() {
        const { enable, loading } = this.props

        if (!enable)
            return null

        if (loading)
            return (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")}></div>
                </div>
            )

        return (
            <div className={cx("icon-wrap")}>
                <img
                    className={cx("icon")}
                    alt="체크"
                    src="/icon/ic_search.svg" />
            </div>
        )
    }

    renderInput() {
        const {
            value,
            maxLength,
            showRemainText,
            enable,
            placeholder
        } = this.props
        const { is_open } = this.state

        return (
            <div className={cx("input-wrap")}>
                <input
                    className={cx("input",
                        (!enable ? "disable" : ""),
                        (is_open ? "open" : ""),
                        (showRemainText ? "show-remain-text" : ""))}
                    value={value}
                    disabled={!enable}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    onFocus={this.handleOnFocus}
                    onChange={this.handleChangeInput} />
                {this.renderRemainText()}
                {this.renderSearchIcon()}
            </div>
        )
    }

    renderList() {
        const { value, minLength, users, registering_id, onSelected } = this.props
        const { is_open } = this.state
        if (!is_open || users.size === 0 || value.length < minLength)
            return null

        const list = users.map(user => (
            <UserItem
                key={user.id}
                item={user}
                loading={user.id === registering_id}
                onSelected={onSelected} />
        ))

        return (
            <div className={cx("user-list-wrap")}>
                <div className={cx("user-list")}>
                    {list}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div
                className={cx("user-search-wrap")}
                ref={this.wrapRef}>
                {this.renderLabel()}
                {this.renderInput()}
                {this.renderList()}
            </div>
        )
    }
}

export default UserSearch;