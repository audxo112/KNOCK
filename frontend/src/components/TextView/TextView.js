import React, {Component} from "react";
import styles from "./TextView.scss"
import classNames from "classnames/bind"
import Label from "components/Label"

const cx = classNames.bind(styles);

class TextView extends Component{
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        value: "",
        enable: true,
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

    render(){
        const {value, enable} = this.props

        return <div className={cx("text-view-wrap")}>
            {this._renderLabel()}
            <div className={cx(
                    "text-view",
                    (!enable ? "disable" : "")
                )}>
                {value}
            </div>
        </div>
    }
}

export default TextView;