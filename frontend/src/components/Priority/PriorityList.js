import React, { Component } from "react";
import styles from "./PriorityList.scss";
import classNames from "classnames/bind";
import { DEBUG } from "const/core";
import { deepEqual } from "utils/equals";

const cx = classNames.bind(styles);

class PriorityItem extends Component {
    static defaultProps = {
        item: {
            name: "",
            value: "",
        },
        selected: false,
        onSelect: (priority) => {
            if (DEBUG)
                console.log(`PriorityItem onSelect is not implements (priority : ${priority})`)
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
        const { item: { name }, selected } = this.props;
        return (<div
            className={cx("priority-item",
                (selected ? "selected" : ""))}
            onClick={this.handleOnSelect}>
            {name}
        </div>)
    }
}

class PriorityList extends Component {
    static defaultProps = {
        label: "",
        value: null,
        max: 0,
        priorityLoading: false,

        onSelectPriority: (value) => {
            if (DEBUG)
                console.log(`onSelectPriority is not implements (value : ${value})`)
        },
        onAppend: () => {
            if (DEBUG)
                console.log("onAppend is not implements")
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            nextProps.value !== this.props.value ||
            nextProps.max !== this.props.max ||
            nextProps.priorityLoading !== this.props.priorityLoading
    }

    _renderLoading() {
        return (
            <div className={cx("loading-wrap")}>
                <div className={cx("loading-progress")}></div>
            </div>
        )
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

    _renderPriorityList() {
        const { value, max, onSelectPriority } = this.props;
        const priorities = [...Array(max).keys()].map(i => i + 1)
        const list = priorities.map(item => (
            <PriorityItem
                key={item}
                item={{
                    name: `중요도 ${item}`,
                    value: item,
                }}
                selected={value === item}
                onSelect={onSelectPriority} />
        ))
        return list
    }

    render() {
        const {
            priorityLoading,
            onAppend
        } = this.props;

        return (
            <div className={cx("priority-list-wrap-out")}>
                <div className={cx("priority-list-wrap")}>
                    <div className={cx("header")}>
                        {this._renderLabel()}
                        <img
                            className={cx("append-btn")}
                            src="/icon/ic_add_circle.svg"
                            alt="추가 버튼"
                            onClick={onAppend} />
                    </div>
                    {priorityLoading ?
                        this._renderLoading() :
                        this._renderPriorityList()}
                </div>
            </div>
        )
    }
}

export default PriorityList;