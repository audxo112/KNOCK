import React, { Component } from "react";
import styles from "./CurationSelector.scss";
import classNames from "classnames/bind";
import Label from "components/Label";
import Selector from "components/Selector";
import { DEBUG } from "const/core";
import { deepEqual, arraysEqual } from "utils/equals";


const cx = classNames.bind(styles);


class CurationSelector extends Component {
    static defaultProps = {
        label: "",
        labelStyle: {
            fontSize: "18px",
            fontWeight: "500",
            fontColor: "white",
            disableColor: "#4A4A4A",
        },
        enable: true,
        groupPlaceholder: "그룹 선택",
        folderPlaceholder: "폴더 선택",
        group: null,
        folder: null,
        curations: null,
        onGroupSelected: (value) => {
            if (DEBUG)
                console.log("onGroupSelected is not implements", value)
        },
        onFolderSelected: (value) => {
            if (DEBUG)
                console.log("onFolderSelected is not implements", value)
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.label !== this.props.label ||
            !deepEqual(nextProps.labelStyle, this.props.labelStyle) ||
            nextProps.enable !== this.props.enable ||
            nextProps.groupPlaceholder !== this.props.groupPlaceholder ||
            nextProps.folderPlaceholder !== this.props.folderPlaceholder ||
            nextProps.group !== this.props.group ||
            nextProps.folder !== this.props.folder ||
            !arraysEqual(nextProps.curations, this.props.curations)
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

    getGroupIcon = (item) => {
        if (item === null)
            return null
        const { view_type } = item

        if (view_type === "L_HorizontalScroll")
            return "/icon/ic_view_type_horizon_large_enabled.svg"
        else if (view_type === "M_HorizontalScroll")
            return "/icon/ic_view_type_horizon_medium_enabled.svg"
        else if (view_type === "S_HorizontalScroll")
            return "/icon/ic_view_type_horizon_small_enabled.svg"
        else if (view_type === "SquareAlbum")
            return "/icon/ic_view_type_horizon_album_enabled.svg"
        else if (view_type === "List")
            return "/icon/ic_view_type_vertical_enabled.svg"
        return ""
    }

    _renderGroupSelector() {
        const { enable, groupPlaceholder, group, curations, onGroupSelected } = this.props;
        const items = curations !== null ? curations : []

        console.log(group)

        return (
            <div className={cx("curation-selector")}>
                <Selector
                    enable={enable}
                    placeholder={groupPlaceholder}
                    value={group ? group.id : null}
                    items={items}
                    itoi={this.getGroupIcon}
                    itos={item => item.title}
                    itok={item => item.id}
                    itov={item => item.id}
                    onSelected={onGroupSelected} />
            </div>
        )
    }

    _renderFolderSelector() {
        const { enable, folderPlaceholder, group, folder, onFolderSelected } = this.props;
        const items = group !== null ? group.folders : []

        var folder_enable = enable
        if (group !== null && group.view_type === "List") {
            folder_enable = false
        }

        return (
            <div className={cx("curation-selector")}>
                <Selector
                    className={cx("curation-selector")}
                    enable={folder_enable}
                    placeholder={folderPlaceholder}
                    value={folder ? folder.id : null}
                    items={items}
                    itos={item => item.title}
                    itok={item => item.id}
                    itov={item => item.id}
                    onSelected={onFolderSelected} />
            </div>
        )
    }

    render() {
        return (
            <div className={cx("curation-selector-wrap")}>
                {this._renderLabel()}
                <div className={cx("curation-selector-input-wrap")}>
                    {this._renderGroupSelector()}
                    <div className={cx("hyphen")} />
                    {this._renderFolderSelector()}
                </div>
            </div>
        )
    }
}

export default CurationSelector;