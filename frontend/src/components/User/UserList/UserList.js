import React, { Component } from "react";
import styles from "./UserList.scss";
import classNames from "classnames/bind";
import { DEBUG } from "const/core"

const cx = classNames.bind(styles);

class UserItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            nickname: "",
            email: "",
            order: 0,
            grade: "",
            default_avatar: null,
            mini_avatar: null,
            micro_avatar: null,
            updated: new Date(),
        },
        selected: false,
        onSelect: (item) => {
            if (DEBUG)
                console.log(`UserItem onSelect is not implements`, item)
        },
    }

    getImage = (resource) => {
        const { item: { updated } } = this.props

        if (resource && resource.image !== null && resource.image !== "") {
            const image = resource.image
            const imageChecker = image.split("base64").length
            if (imageChecker > 1) return image
            else if (imageChecker === 1) return `${image}?${updated}`
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

    handleOnSelect = () => {
        const { item, onSelect } = this.props
        if (item.toJS) {
            onSelect(item.toJS())
        }
        else {
            onSelect(item)
        }
    }

    render() {
        const { item, selected } = this.props
        const avatar = this.getAvatar()

        return (
            <div
                className={cx("user-item",
                    (selected ? "selected" : ""))}
                onClick={this.handleOnSelect}>
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
                <div className={cx("user-info")}>
                    <div className={cx("nickname")}>
                        {item.nickname}
                    </div>
                    {item.email !== "" && (
                        <div className={cx("email")}>
                            {item.email}
                        </div>
                    )}
                </div>

            </div>
        )
    }

}

class UserList extends Component {
    static defaultProps = {
        loading: false,
        selected: null,
        users: [],
        onSelect: (item) => {
            if (DEBUG)
                console.log(`UserList onSelect is not implements`, item)
        },
    }

    renderLoading() {
        return (
            <div className={cx("loading-wrap")}>
                <div className={cx("loading-progress")}></div>
            </div>
        )
    }

    renderUserList() {
        const { users, selected, onSelect } = this.props
        if (users === null)
            return null;

        const list = users.map(item => {
            var user = item
            if (
                user.id &&
                selected !== null &&
                selected.id &&
                user.id === selected.id) {
                user = selected
            }

            return (
                <UserItem
                    key={item.id}
                    id={item.id}
                    item={user}
                    selected={user === selected}
                    onSelect={onSelect} />
            )
        })

        return list
    }

    render() {
        const { loading } = this.props
        return <div className={cx("user-list-out")}>
            <div className={cx("user-list-wrap")}>
                <div className={cx("header")}>
                    <div className={cx("label")}>계정</div>
                </div>
                {loading ?
                    this.renderLoading() :
                    this.renderUserList()}
            </div>
        </div>
    }
}

export default UserList;