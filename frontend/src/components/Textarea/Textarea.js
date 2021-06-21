import React, { Component } from "react";
import styles from "./Textarea.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

class Textarea extends Component {
    static defaultProps = {
        label: "",
        name: "",
        value: "",
        placeholder: "",
        onChange: (name, value) => {
            console.log(`onChange is not implement (${name}, ${value})`)
        }
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        const { onChange } = this.props;

        e.target.style.height = "5px";
        e.target.style.height = `${e.target.scrollHeight}px`;

        onChange(name, value)
    }

    _renderLabel() {
        const { label } = this.props;
        if (label === "")
            return null;

        return (<div className={"label-wrap"}>
            <div className={cx("label")}>
                {label}
            </div>
        </div>)
    }

    render() {
        const { name, value, placeholder } = this.props;
        return <div className={cx("text-area-wrap")}>
            {this._renderLabel()}
            <textarea
                className={cx("text-area")}
                name={name}
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={this.handleChangeInput} />
        </div>
    }
}

export default Textarea;