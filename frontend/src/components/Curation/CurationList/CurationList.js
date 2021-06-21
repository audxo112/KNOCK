import React, { Component } from "react";
import styles from "./CurationList.scss";
import classNames from "classnames/bind";
import { DEBUG } from "const/core"
import { deepEqual } from "utils/equals";
import { GROUP_LIST, OLD_GROUP_LIST, getScrollIcon } from "./const"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const cx = classNames.bind(styles);


class InnerGroupItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            title: "",
            view_type: "",
            post_start_datetime: null,
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item)
    }

    render() {
        const { item } = this.props
        const today = new Date()
        const start = new Date(item.post_start_datetime)
        const is_reservation = today < start

        return (
            <>
                <div className={cx("info")}>
                    <div className={cx("scroll-type")}>
                        <img
                            className={cx("view-type-scroll-icon")}
                            alt="뷰타입"
                            src={getScrollIcon(item.view_type)} />
                    </div>
                    <div className={cx("title")}>
                        {item.title}
                    </div>
                </div>
                <div className={cx("info")}>
                    <div className={cx("post")}>
                        <div className={cx("status")}>
                            {is_reservation ?
                                `예약중 ${start.toISOString().slice(2, 10)}` :
                                "게시중"
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


class GroupItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            title: "",
            view_type: "",
            post_start_datetime: null,
        },
        selected: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        }
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    renderDraggableItem() {
        const { item, selected, index } = this.props
        const id = item.id !== "" ? item.id : "current"

        return (
            <Draggable
                draggableId={id}
                index={index}>
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={
                            cx("group-item",
                                "draggable",
                                (selected ? "selcted" : ""))}
                        onClick={this.handleOnSelected}>
                        <InnerGroupItem
                            item={item} />
                    </div>
                )}
            </Draggable>
        )
    }

    renderItem() {
        const { item, selected } = this.props

        return (
            <div className={
                cx("group-item",
                    (selected ? "selected" : ""))}
                onClick={this.handleOnSelected}>
                <InnerGroupItem
                    item={item} />
            </div>
        )
    }

    render() {
        const { draggable } = this.props
        if (draggable) return this.renderDraggableItem()
        else return this.renderItem()
    }
}

class OldGroupItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            title: "",
            view_type: "",
            post_start_datetime: null,
        },
        selected: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implement", item)
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item) ||
            nextProps.selected !== this.props.selected
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    render() {
        const { item, selected } = this.props

        return (
            <div className={cx("old-group-item",
                (selected ? "selected" : ""))}
                onClick={this.handleOnSelected}>
                <div className={cx("info")}>
                    <div className={cx("scroll-type")}>
                        <img
                            className={cx("view-type-scroll-icon")}
                            alt="스크롤방향"
                            src={getScrollIcon(item.view_type)} />
                    </div>
                    <div className={cx("title")}>
                        {item.title}
                    </div>
                </div>
            </div>
        )
    }
}

class InnerFolderItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            title: "",
            theme_count: 0,
            default_cover: "",
            mini_cover: "",
            micro_cover: "",
            updated: new Date(),
        }
    }

    shouldComponentUpdate(nextProps) {
        return !deepEqual(nextProps.item, this.props.item)
    }

    getUrlEnd = () => {
        const { updated } = this.props.item
        if (updated.getTime) return `?${updated.getTime()}`
        else return `?${new Date(updated).getTime()}`
    }

    getImage = (res) => {
        if (
            !res ||
            !res.image ||
            res.image === ""
        ) return ""

        const image = res.image
        const imageChecker = image.split("base64").length
        if (imageChecker > 1) return image
        else if (imageChecker === 1) return `${image}?${this.getUrlEnd()}`

        return ""
    }

    getCover = () => {
        const {
            default_cover,
            mini_cover,
            micro_cover,
        } = this.props.item

        var image = this.getImage(micro_cover)
        if (image === "") {
            image = this.getImage(mini_cover)
        }
        if (image === "") {
            image = this.getImage(default_cover)
        }
        return image
    }

    render() {
        const { item } = this.props

        return (<>
            <div className={cx("cover-wrap")}>
                <img className={cx("cover")}
                    alt="커버"
                    src={this.getCover()} />
            </div>
            <div className={cx("title")}>
                {item.title}
            </div>
            <div className={cx("theme-count")}>
                {item.theme_count !== undefined ?
                    `${item.theme_count}개` :
                    "작성중"}
            </div>
        </>)
    }
}

class FolderItem extends Component {
    static defaultProps = {
        item: {
            id: "",
            title: "",
            theme_count: 0,
            default_cover: "",
            mini_cover: "",
            micro_cover: "",
            updated: new Date(),
        },
        selected: false,
        draggable: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        }
    }

    handleOnSelected = () => {
        const { item, onSelected } = this.props
        onSelected(item)
    }

    renderItem() {
        const { item, selected } = this.props
        return (
            <div className={cx("folder-item",
                (selected ? "selected" : ""))}
                onClick={this.handleOnSelected}>
                <InnerFolderItem
                    item={item} />
            </div>
        )
    }

    renderDraggableItem() {
        const { item, selected, index } = this.props
        const id = item.id !== "" ? item.id : "current"

        return (
            <Draggable
                draggableId={id}
                index={index}>
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={
                            cx("folder-item",
                                "draggable",
                                (selected ? "selected" : ""))}
                        onClick={this.handleOnSelected}>
                        <InnerFolderItem
                            item={item} />
                    </div>
                )}
            </Draggable>
        )
    }

    render() {
        const { draggable } = this.props
        if (draggable) return this.renderDraggableItem()
        else return this.renderItem()
    }
}

class InnerGroupList extends Component {
    static defaultProps = {
        enable_old_groups: false,
        loading: false,
        items: [],
        selected: false,
        draggable: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
        onChangePage: (page) => {
            if (DEBUG)
                console.log("onChangedPage is not implements", page)
        }
    }

    render() {
        const { enable_old_groups, loading, items, selected, draggable, onSelected, onChangePage } = this.props
        var list = null
        if (items !== null) {
            list = items.map((item, index) => {
                const id = item.id !== "" ? item.id : "current"
                return (
                    <GroupItem
                        key={id}
                        index={index}
                        item={item}
                        selected={id === selected}
                        draggable={draggable}
                        onSelected={onSelected} />
                )
            })
        }

        return (<>
            <div className={cx("group-header")}>
                <div className={cx("group-label")}>
                    그룹 목록
                </div>
                {enable_old_groups && (
                    <img
                        className={cx("change-page")}
                        src="/icon/ic_list_next.svg"
                        alt="페이지 변경"
                        onClick={onChangePage} />
                )}
            </div>
            {loading ? (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")} />
                </div>
            ) : (
                <div className={cx("group-list")}>
                    {list}
                </div>
            )}
        </>)
    }
}

class GroupList extends Component {
    static defaultProps = {
        enable_old_groups: false,
        loading: false,
        items: [],
        selected: false,
        draggable: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
        onChangePage: (page) => {
            if (DEBUG)
                console.log("onChangedPage is not implements", page)
        }
    }

    handleOnChangePage = () => {
        const { onChangePage } = this.props
        onChangePage(OLD_GROUP_LIST)
    }

    renderInnerList() {
        const { enable_old_groups, loading, items, selected, draggable, onSelected } = this.props
        return (
            <InnerGroupList
                enable_old_groups={enable_old_groups}
                loading={loading}
                items={items}
                selected={selected}
                draggable={draggable}
                onSelected={onSelected}
                onChangePage={this.handleOnChangePage} />
        )
    }

    renderDroppableList() {
        return (
            <Droppable
                droppableId="groups">
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cx("group-list-wrap")}>
                        {this.renderInnerList()}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }

    renderList() {
        return (
            <div className={cx("group-list-wrap")}>
                {this.renderInnerList()}
            </div>
        )
    }

    render() {
        const { draggable } = this.props
        return (
            <div className={cx("group-list-wrap-out")}>
                {draggable ?
                    this.renderDroppableList() :
                    this.renderList()}
            </div>
        )
    }
}

class OldGroupList extends Component {
    static defaultProps = {
        loading: false,
        items: [],
        selected: "",
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
        onChangePage: (page) => {
            if (DEBUG)
                console.log("onChangedPage is not implements", page)
        }
    }

    handleOnChangePage = () => {
        const { onChangePage } = this.props
        onChangePage(GROUP_LIST)
    }

    render() {
        const { loading, items, selected, onSelected } = this.props
        var list = null
        if (items !== null) {
            list = items.map(item => {
                return (
                    <OldGroupItem
                        key={item.id}
                        item={item}
                        selected={item.id === selected}
                        onSelected={onSelected} />
                )
            })
        }

        return (
            <div className={cx("group-list-wrap-out")}>
                <div className={cx("group-list-wrap")}>
                    <div className={cx("group-header")}>
                        <div className={cx("group-label")}>
                            보관함
                    </div>
                        <img className={cx("change-page")}
                            src="/icon/ic_list_previous.svg"
                            alt="페이지 변경"
                            onClick={this.handleOnChangePage} />
                    </div>
                    {loading ? (
                        <div className={cx("loading-wrap")}>
                            <div className={cx("loading-progress")} />
                        </div>
                    ) : (
                        <div className={cx("old-group-list")}>
                            {list}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

class InnerFolderList extends Component {
    static defaultProps = {
        loading: false,
        items: [],
        selected: false,
        draggable: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        },
    }

    render() {
        const { loading, items, selected, draggable, onSelected } = this.props
        var list = null
        if (items !== null) {
            list = items.map((item, index) => {
                const id = item.id !== "" ? item.id : "current"
                return (
                    <FolderItem
                        key={id}
                        index={index}
                        item={item}
                        selected={id === selected}
                        draggable={draggable}
                        onSelected={onSelected} />
                )
            })
        }
        return (<>
            {loading ? (
                <div className={cx("loading-wrap")}>
                    <div className={cx("loading-progress")} />
                </div>
            ) : (
                <div className={cx("folder-list")}>
                    {list}
                </div>
            )}
        </>)
    }
}

class FolderList extends Component {
    static defaultProps = {
        enable_old_groups: false,
        loading: false,
        items: [],
        selected: false,
        onSelected: (item) => {
            if (DEBUG)
                console.log("onSelected is not implements", item)
        }
    }

    renderInnerList() {
        const { loading, items, selected, draggable, onSelected } = this.props
        return (
            <InnerFolderList
                loading={loading}
                items={items}
                selected={selected}
                draggable={draggable}
                onSelected={onSelected} />
        )
    }

    renderDroppableList() {
        return (
            <Droppable
                droppableId="folders">
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cx("folder-list-wrap")}>
                        {this.renderInnerList()}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }

    renderList() {
        return (
            <div className={cx("folder-list-wrap")}>
                {this.renderInnerList()}
            </div>
        )
    }

    render() {
        const { draggable } = this.props
        return (
            <div className={cx("folder-list-wrap-out")}>
                {draggable ?
                    this.renderDroppableList() :
                    this.renderList()}
            </div>
        )
    }
}

class CurationList extends Component {
    static defaultProps = {
        enable_old_groups: false,
        enable_folders: false,
        draggable_group: false,
        draggable_folder: false,
        loading_groups: false,
        loading_folders: false,
        selected_group: "",
        selected_folder: "",
        groups: [],
        folders: [],
        onMoveGroup: (result) => {
            if (DEBUG)
                console.log("onMoveGroup is not implements", result)
        },
        onMoveFolder: (result) => {
            if (DEBUG)
                console.log("onMoveFolder is not implements", result)
        },
        onSelectedGroup: (item) => {
            if (DEBUG)
                console.log("onSelectedGroup is not implements", item)
        },
        onSelectedFolder: (item) => {
            if (DEBUG)
                console.log("onSelectedFolder is not implements", item)
        },
        onChangePage: (page) => {
            if (DEBUG)
                console.log("onChangePage is not implements", page)
        }
    }

    state = {
        page: GROUP_LIST
    }

    handleOnChangePage = (page) => {
        const { onChangePage } = this.props
        this.setState({
            page: page
        })
        onChangePage(page)
    }

    handleOnDragEnd = (result) => {
        const { destination } = result
        if (!destination) return;

        const move = {
            src: result.source.index,
            dst: result.destination.index,
        }

        if (destination.droppableId === "groups") {
            const { onMoveGroup } = this.props
            onMoveGroup(move)
        }
        else if (destination.droppableId === "folders") {
            const { onMoveFolder } = this.props
            onMoveFolder(move)
        }
    }

    renderList() {
        const {
            enable_old_groups,
            enable_folders,
            draggable_group,
            draggable_folder,
            loading_groups,
            loading_folders,
            selected_group,
            selected_folder,
            groups,
            folders,
            onSelectedGroup,
            onSelectedFolder } = this.props
        const { page } = this.state

        return (
            <div className={cx("curation-list-wrap")}>
                {enable_folders && (
                    <FolderList
                        loading={loading_folders}
                        items={folders}
                        selected={selected_folder}
                        draggable={draggable_folder}
                        onSelected={onSelectedFolder} />
                )}
                {page === GROUP_LIST && (
                    <GroupList
                        enable_old_groups={enable_old_groups}
                        loading={loading_groups}
                        items={groups}
                        selected={selected_group}
                        draggable={draggable_group}
                        onSelected={onSelectedGroup}
                        onChangePage={this.handleOnChangePage} />
                )}
                {page === OLD_GROUP_LIST && (
                    <OldGroupList
                        loading={loading_groups}
                        items={groups}
                        selected={selected_group}
                        onSelected={onSelectedGroup}
                        onChangePage={this.handleOnChangePage} />
                )}
            </div>
        )
    }

    renderDraggableList() {
        return (
            <DragDropContext
                onDragEnd={this.handleOnDragEnd}>
                {this.renderList()}
            </DragDropContext>
        )
    }

    render() {
        const {
            enable_folders,
            draggable_group,
            draggable_folder,
        } = this.props

        return (
            <div className={cx("curation-list-wrap-out")}>
                {draggable_group ||
                    (enable_folders && draggable_folder) ?
                    this.renderDraggableList() :
                    this.renderList()}
            </div>
        )
    }
}

export default CurationList;