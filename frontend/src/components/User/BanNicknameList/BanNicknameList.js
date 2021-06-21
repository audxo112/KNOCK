import React, { Component } from "react"
import styles from "./BanNicknameList.scss"
import classNames from "classnames/bind"
import { Map } from "immutable"
import { DEBUG } from "const/core"
import { deepEqual, arraysEqual } from "utils/equals";
import CheckBox from "components/CheckBox"

const cx = classNames.bind(styles)

class BanNicknameItem extends Component {
    static defaultProps = {
        item: {
            id: -1,
            nickname: "",
        },
        loading: false,
        onDelete: (item) => {
            if (DEBUG)
                console.log("onDelete is not implements", item)
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item) ||
            nextProps.loading !== this.props.loading
    }

    handleOnDelete = () => {
        const { item, onDelete } = this.props
        onDelete(item)
    }

    renderDeleteIcon() {
        const { loading } = this.props
        if (loading) {
            return (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")}></div>
                </div>
            )
        }

        return (
            <div className={cx("delete")}
                onClick={this.handleOnDelete}>
                <img src="/icon/ic_delete_box.svg" alt="삭제" />
            </div>
        )
    }

    render() {
        const { item } = this.props
        return (
            <div className={cx("item")}>
                <div className={cx("nickname")}>
                    {item.nickname}
                </div>
                {this.renderDeleteIcon()}
            </div>
        )
    }
}

class BanNicknameList extends Component {
    static defaultProps = {
        loading: false,
        deleting_id: "",
        header: [],
        items: Map(),
        filter: "",
        onDelete: (item) => {
            if (DEBUG)
                console.log("onDelete is not implements", item)
        },
        onChecked: (checked, value) => {
            if (DEBUG)
                console.log("onChecked is not implements", checked, value)
        },
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.loading !== this.props.loading ||
            nextProps.deleting_id !== this.props.deleting_id ||
            !arraysEqual(nextProps.header, this.props.header) ||
            nextProps.items !== this.props.items ||
            nextProps.filter !== this.props.filter
    }

    renderFilter() {
        const { filter, onChecked } = this.props
        return (
            <div className={cx("filter-wrap")}>
                <CheckBox
                    className={cx("filter")}
                    label="전체"
                    value="all"
                    checked={filter === "all"}
                    onChecked={onChecked} />
                <CheckBox
                    className={cx("filter")}
                    label="A - Z"
                    value="english"
                    checked={filter === "english"}
                    onChecked={onChecked} />
                <CheckBox
                    className={cx("filter")}
                    label="ㄱ - ㅎ"
                    value="korean"
                    checked={filter === "korean"}
                    onChecked={onChecked} />
            </div>
        )
    }

    renderList() {
        const { header, items, onDelete, deleting_id } = this.props
        const list = header.map(key => {
            const item = items.get(key)
            const nList = item.map(item => {
                return (
                    <BanNicknameItem
                        key={item.id}
                        item={item}
                        loading={item.id === deleting_id}
                        onDelete={onDelete} />
                )
            })

            return (
                <div
                    className={cx("ban-nickname-list")}
                    key={key}>
                    <div className={cx("header")}>
                        {key}
                    </div>
                    <div className={cx("ban-nickname-items")}>
                        {nList}
                    </div>
                </div>
            )
        })

        return list
    }

    render() {
        return (
            <div className={cx("ban-nickname-list-wrap")}>
                {this.renderFilter()}
                <div className={cx("divider")}></div>
                {this.renderList()}
            </div>
        )
    }
}

export default BanNicknameList