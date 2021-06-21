import React, { Component } from "react";
import { connect } from "react-redux"
import Modal from "./Modal";

import {PopupActions} from "store/actionCreators";

class ModalPage extends Component {
    handleOnConfirm = () => {
        const {confirmData, onConfirm} = this.props
        onConfirm(confirmData)
        PopupActions.dismiss()
    }

    handleOnCancel = () => {
        const {onCancel, oneBtn} = this.props
        if(oneBtn)
            return;
        onCancel()
        PopupActions.dismiss()
    }

    handleOnTouchOutside = (e) => {
        e.stopPropagation()
        const {canceledOnTouchOutside} = this.props
        if(!canceledOnTouchOutside)
            return;
        PopupActions.dismiss()
    }

    render() {
        const {isOpen} = this.props
        if(!isOpen)
            return null

        const {
            oneBtn,
            content,
            confirmText,
            cancelText
        } = this.props

        return (
            <Modal
                oneBtn={oneBtn}
                content={content}
                confirmText={confirmText}
                cancelText={cancelText}
                onConfirm={this.handleOnConfirm}
                onCancel={this.handleOnCancel}
                onTouchOutside={this.handleOnTouchOutside}/>
        )
    }
}

export default connect(
    ({ popup }) => {
        return {
            isOpen:popup.isOpen,
            canceledOnTouchOutside:popup.canceledOnTouchOutside,
            oneBtn:popup.oneBtn,
            content:popup.content,
            confirmText:popup.confirmText,
            confirmData:popup.confirmData,
            onConfirm:popup.onConfirm,
            cancelText:popup.cancelText,
            onCancel:popup.onCancel,
        }
    }
)(ModalPage);