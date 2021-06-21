import React, { Component } from "react";
import styles from "./GroupViewType.scss";
import classNames from "classnames/bind";
import { DEBUG } from "const/core"
import { VIEW_TYPES } from "./data"
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

class ViewTypeItem extends Component {
    static defaultProps = {
        item: {
            name: "",
            value: "",
            icon: {
                enable: "",
                disable: "",
            },
            image: "",
        },
        selected: "",
        onSelect: (value) => {
            if (DEBUG)
                console.log("onSelect is not implements", value)
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item) ||
            nextProps.selected !== this.props.selected
    }

    handleOnSelect = () => {
        const { item, onSelect } = this.props
        onSelect(item.value)
    }

    render() {
        const { item: { name, icon, image }, selected } = this.props

        return (
            <div className={cx(
                "view-type-item-wrap",
                (selected ? "selected" : ""))}
                onClick={this.handleOnSelect}>
                <div className={cx("view-type-header")}>
                    <img
                        className={cx("view-type-scroll-icon")}
                        alt="아이콘"
                        src={selected ? icon.enable : icon.disable} />
                    <div className={cx(
                        "view-type-label",
                        (selected ? "selected" : ""))}>
                        {name}
                    </div>
                </div>
                <div className={cx("view-type-image-wrap",
                    (selected ? "selected" : "")
                )}>
                    <img
                        className={cx("view-type-image")}
                        alt={name}
                        src={image} />

                    {selected &&
                        <div className={cx("view-type-selected")}></div>
                    }
                </div>
            </div>
        )
    }
}

class CurationGroupViewType extends Component {
    static defaultProps = {
        label: "",
        value: null,
        enable: true,
        onSelect: (value) => {
            if (DEBUG)
                console.log("onSelect is not implements", value)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            nextProps.value !== this.props.value ||
            nextProps.enable !== this.props.enable
    }

    _renderLabel() {
        const { label } = this.props;
        if (label === "")
            return null;

        return (
            <div className={cx("label-wrap")}>
                <div className={cx("label")}>
                    {label}
                </div>
            </div>
        )
    }

    _renderViewTypeGrid() {
        const { value, onSelect } = this.props
        const items = VIEW_TYPES.map(item => (
            <ViewTypeItem
                key={item.value}
                item={item}
                selected={item.value === value}
                onSelect={onSelect}
            />
        ))
        return <div className={cx("view-type-grid")}>
            {items}
        </div>
    }

    render() {
        return (
            <div className={cx("curation-group-view-type-wrap")}>
                {this._renderLabel()}
                {this._renderViewTypeGrid()}
            </div>
        )
    }
}

export default CurationGroupViewType;