import React, { Component } from "react";
import styles from "./Selector.scss";
import classNames from "classnames/bind";
import { List } from "immutable";
import Label from "components/Label";
import { DEBUG } from "const/core";
import { deepEqual, arraysEqual } from "utils/equals";

const cx = classNames.bind(styles);

class SelectorItem extends Component {
    static defaultProps = {
        item: "",
        selected: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
        itoi: (item) => null,
        itos: (item) => item,
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item) ||
            nextProps.selected !== this.props.selected
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    _renderIcon() {
        const { item, itoi } = this.props
        const icon = itoi(item)

        if (icon === null)
            return null

        return <img className="selector-icon" src={icon} alt="selecot-icon" />
    }

    render() {
        const { item, selected, itos } = this.props;
        const name = itos(item)

        return (
            <div
                className={cx("selector-item",
                    (selected ? "selected" : ""))}
                onClick={this.handleOnSelected}>
                {this._renderIcon()}
                <div className={cx("selector-text")}>
                    {name}
                </div>
            </div>
        )
    }
}

class Selector extends Component {
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
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
        itoi: (item) => null,
        itok: (item) => item,
        itov: (item) => item,
        itos: (item) => item,
    }

    state = {
        is_open: false,
    }

    openIcon = {
        open: "/icon/ic_expand_less.svg",
        close: "/icon/ic_expand_more.svg"
    }

    wrapRef = React.createRef()

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.is_open !== this.state.is_open ||
            nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.value !== this.props.value ||
            nextProps.placeholder !== this.props.placeholder ||
            nextProps.enable !== this.props.enable ||
            !arraysEqual(nextProps.items, this.props.items)
    }

    handleToggleOpen = () => {
        const { enable } = this.props
        if (!enable) return

        this.setState({
            is_open: !this.state.is_open
        })
    }

    handleOnSelect = (item) => {
        const { enable, onSelected } = this.props
        if (!enable) return
        this.setState({
            is_open: false
        })
        onSelected(item)
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

        const { value, items, itoi, itok, itov, itos } = this.props;

        if (items === null || items.length === 0 || items.size === 0)
            return null

        const val = value !== null ? itov(value) : null
        const list = items.map(item => {
            const k = itok(item)
            const v = itov(item)
            return (
                <SelectorItem
                    key={k}
                    item={item}
                    selected={val === v}
                    onSelected={this.handleOnSelect}
                    itoi={itoi}
                    itos={itos} />)
        })

        return (
            <div className={cx("selector-list-wrap")}>
                <div
                    className={cx("selector-list")}>
                    {list}
                </div>
            </div>)
    }

    _renderIcon() {
        const { value, itoi } = this.props
        const icon = itoi(value)

        if (icon === null)
            return null

        return <img className="selector-icon" src={icon} alt="selecot-icon" />
    }

    getSelectorText = () => {
        const { value, itov, itos, items } = this.props

        var count = 0
        if (items.length) count = items.length
        else if (items.size) count = items.size

        for (let i = 0; i < count; i++) {
            var item = null
            if (items.get) item = items.get(i)
            else item = items[i]

            if (value === itov(item)) {
                return itos(item)
            }
        }
        return null
    }

    render() {
        const { enable, placeholder } = this.props;
        const { is_open } = this.state

        const text = this.getSelectorText()
        const cIcon = is_open ? this.openIcon.open : this.openIcon.close

        return (
            <div className={cx("selector-wrap",
                (!enable ? "disable" : ""))}
                ref={this.wrapRef}>
                {this._renderLabel()}
                <div className={cx("selector-input-wrap")}>
                    <div
                        className={cx("selector-current",
                            (is_open ? "open" : ""),
                            (text === null ? "placeholder" : "")
                        )}
                        onClick={this.handleToggleOpen}>
                        {this._renderIcon()}
                        <div className={cx("selector-text")}>
                            {text !== null ? text : placeholder}
                        </div>

                        <img
                            className={cx("selector-open-icon")}
                            src={cIcon}
                            alt="open_icon" />
                    </div>
                    {this._renderList()}
                </div>
            </div>
        )
    }
}

export default Selector;