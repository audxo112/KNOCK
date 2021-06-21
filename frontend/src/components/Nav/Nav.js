import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Nav.scss";
import classNames from "classnames/bind";
import { nav, user } from "./data";

import { logout } from "service/authService";

const cx = classNames.bind(styles)

class Nav extends Component {
    state = {
        hovered: "",
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.location.pathname !== this.props.location.pathname ||
            nextState.hovered !== this.state.hovered
    }

    handleOnMouseOver = (e) => {
        const { target: { className, name } } = e

        if (className.includes("nav-sub"))
            return

        if (className === "nav-menu") {
            this.setState({
                hovered: name
            })
        }
        else {
            this.setState({
                hovered: ""
            })
        }
    }

    handleOnMouseLeave = () => {
        this.setState({
            hovered: ""
        })
    }

    handleLogout = () => {
        logout()
    }

    _renderNavItem(item) {
        const { hovered } = this.state
        return (
            <NavLink
                className={
                    cx("nav-menu",
                        (item.name === hovered ? "hover" : ""))
                }
                key={item.to}
                name={item.name}
                exact
                isActive={item.isActive ? (match, location) => {
                    return location.pathname.startsWith("/" + item.name)
                } : null}
                to={item.to}>
                {item.label}
            </NavLink>
        )
    }

    _renderNav() {
        const list = nav.mains.map(main => {
            return this._renderNavItem(main)
        })
        return <>{list}</>
    }

    _renderNavSub() {
        const current = this.props.location.pathname.split("/")[1]
        const { hovered } = this.state
        const render = hovered !== "" ? hovered : current

        const subs = nav.subs[render]
        if (subs === undefined)
            return (
                <div className={cx("nav-sub-wrapper")}></div>
            )

        const list = subs.map(sub => {
            return (
                <NavLink
                    className={cx("nav-sub-menu")}
                    key={sub.to}
                    exact to={sub.to}>
                    {sub.label}
                </NavLink>
            )
        })
        return (<>{list}</>)
    }

    render() {
        const current = this.props.location.pathname.split("/")[1]
        const { hovered } = this.state
        const render = hovered !== "" ? hovered : current

        return (
            <>
                <div className={cx("nav-wrapper")}
                    onMouseOver={this.handleOnMouseOver}
                    onMouseLeave={this.handleOnMouseLeave}>
                    <Link
                        className={cx("nav-logo")}
                        to="/">
                        <img src="/logo.png" alt="로고" />
                    </Link>
                    {this._renderNav()}

                    <div className={cx("nav-space")}></div>

                    {this._renderNavItem(user)}

                    <div className={cx("nav-profile-wrapper")}>
                        <div className={cx("nav-profile")}
                            onClick={this.handleLogout}>
                        </div>
                    </div>

                    <div className={cx("nav-sub-wrapper",
                        (hovered === render ? "hover" : ""),
                        (current === render ? "active" : ""))}>
                        <div className={cx("nav-logo-space")} />
                        {this._renderNavSub()}
                    </div>
                </div>

                <div className={cx("nav-pos")}></div>
            </>
        )
    }
}

export default Nav;