import React, { Component } from "react";
import styles from "./RippleBtn.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

class RippleBtn extends Component {
    static defaultProps = {
        onClick: (e) => { console.log("onClick is not implements") }
    }

    initializeState = () => {
        return {
            spanStyles: {},
            count: 0
        }
    }

    state = this.initializeState()

    showRipple = (e) => {
        const rippleContainer = e.target;
        const size = rippleContainer.offsetWidth;
        const pos = rippleContainer.getBoundingClientRect();
        const x = e.pageX - pos.x - (size / 2);
        const y = e.pageY - pos.y - (size / 2);
        const spanStyles = { top: y + 'px', left: x + 'px', height: size + 'px', width: size + 'px' };
        const count = this.state.count + 1;
        this.setState({
            spanStyles: {
                ...this.state.spanStyles,
                [count]: spanStyles
            },
            count: count
        });

    }

    renderRippleSpan = () => {
        const { spanStyles = {} } = this.state;

        const spanArray = Object.keys(spanStyles);
        if (spanArray && spanArray.length > 0) {
            return (
                spanArray.map((key, index) => {
                    return (
                        <span
                            key={`spanCount_${index}`}
                            style={{ ...spanStyles[key] }}>
                        </span>
                    )
                })
            )
        } else {
            return null;
        }
    }

    cleanUp = () => {
        const initialState = this.initializeState();
        this.setState({
            ...initialState
        });
    }

    callCleanUp = (delay) => {
        return () => {
            clearTimeout(this.bounce)
            this.bounce = setTimeout(() => {
                this.cleanUp();
            }, delay);
        }
    }

    render() {
        const { className = "", children, onClick } = this.props;
        return (
            <div
                className={cx("ripple", className)}
                onClick={onClick}>
                {children}
                <div
                    className={cx("rippleContainer")}
                    onMouseDown={this.showRipple}
                    onMouseUp={this.callCleanUp(850)}>
                    {this.renderRippleSpan()}
                </div>
            </div>
        )
    }
}

export default RippleBtn;