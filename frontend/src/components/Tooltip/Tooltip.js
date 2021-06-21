import React, { Component } from "react"
import styles from "./Tooltip.scss"
import classNames from "classnames/bind"
import { DEBUG } from "const/core"

const cx = classNames.bind(styles)

class Tooltip extends Component {
    static defaultProps = {
        content: null,
    }

    state = {
        active: false,
        x: 0,
        y: 0,
    }

    handleMouseEnter = (e) => {
        const { x, y } = e.nativeEvent
        this.setState({
            active: true,
            x: x,
            y: y,
        })
    }

    handleMouseLeave = (e) => {
        const { x, y } = e.nativeEvent
        this.setState({
            active: false,
            x: x,
            y: y,
        })
    }

    handleMouseMove = (e) => {
        e.preventDefault()
        const { x, y } = e.nativeEvent
        this.setState({
            active: this.state.active,
            x: x,
            y: y,
        })
    }

    render() {
        const { classNames, content, children } = this.props
        const { active, x, y } = this.state

        return <div className={cx("tooltip-container", classNames)}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onMouseMove={this.handleMouseMove}>
            {children}
            {active && (
                <div className={cx("tooltip-content")}
                    style={{
                        left: x + 15,
                        top: y + 15,
                    }}>{content}</div>
            )}
        </div>
    }
}

export default Tooltip;