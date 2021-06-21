import React, { Component } from "react";
import styles from "./Tag.scss";
import classNames from "classnames/bind"
import Label from "components/Label"
import { List } from "immutable";
import { DEBUG } from "const/core";
import { deepEqual, arraysEqual } from "utils/equals";

const cx = classNames.bind(styles);

class TagItem extends Component {
    static defaultProps = {
        item: {
            id: 0,
            tag: "",
        },
        onDelete: (item) => {
            if (DEBUG)
                console.log("onDelete is not implements", item)
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item)
    }

    handleDeleteTag = () => {
        const { item, onDelete } = this.props
        onDelete(item)
    }

    render() {
        const { item } = this.props

        return (
            <div className={cx("tag-item")}>
                <div className={cx("tag-text")}>{item.tag}</div>
                <img
                    className={cx("tag-delete-ic")}
                    onClick={this.handleDeleteTag}
                    src="/icon/ic_delete_box.svg"
                    alt="delete_icon" />
            </div>
        )
    }
}

class Tag extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        placeholder: "",
        enable: true,
        editable: true,
        tags: List(),
        onCreate: (value) => {
            if (DEBUG)
                console.log("onCreate is not implements", value)
        },
        onChange: (value) => {
            if (DEBUG)
                console.log("onChange is not implements", value)
        },
        onDelete: (tag) => {
            if (DEBUG)
                console.log("onDelete is not implements", tag)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.placeholder !== this.props.placeholder ||
            nextProps.enable !== this.props.enable ||
            nextProps.editable !== this.props.editable ||
            !arraysEqual(nextProps.tags, this.props.tags)
    }

    handleOnChange = (e) => {
        const { value } = e.target
        const { onChange } = this.props

        onChange(value)
    }

    handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            const { value } = e.target
            const { onChange, onCreate } = this.props

            onChange("")
            onCreate(value)
        }
    }

    _renderLabel() {
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

    _renderInput() {
        const { value, editable, placeholder } = this.props;
        if (!editable)
            return null;

        return (
            <div className={cx("tag-input-wrap")}>
                <input
                    className={cx("tag-input")}
                    value={value}
                    placeholder={placeholder}
                    autoComplete="off"
                    onChange={this.handleOnChange}
                    onKeyPress={this.handleOnKeyPress} />
            </div>
        )
    }

    _renderList() {
        const { tags, onDelete } = this.props;
        if (tags.size === 0) {
            return null
        }

        const items = tags.map(tag => {
            return (
                <TagItem
                    key={tag.id}
                    item={tag}
                    onDelete={onDelete} />
            )
        })
        return (
            <div className={cx("tag-list")}>
                {items}
            </div>
        );
    }

    render() {
        return (
            <div className={cx("tag-wrapper")}>
                {this._renderLabel()}
                {this._renderInput()}
                {this._renderList()}
            </div>
        )
    }
}

export default Tag;