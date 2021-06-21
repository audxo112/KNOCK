import React, {Component} from "react";
import styles from "./Modal.scss";
import classNames from "classnames/bind"
import {DEBUG} from "const/core";

const cx = classNames.bind(styles)

class Modal extends Component{
    static defaultProps = {
        oneBtn:true,
        content:"",
        confirmText:"확인",
        cancelText:"취소",
        onConfirm:()=>{
            if(DEBUG)
                console.log("onConfirm is not implements")
        },
        onCancel:()=>{
            if(DEBUG)
                console.log("onCancel is not implements")
        },
        onTouchOutside:()=>{
            if(DEBUG)
                console.log("onTouchOutside is not implements")
        },
        onEnter:()=>{
            if(DEBUG)
                console.log("onEnter is not implements")
        }
    }

    handleStopEvent = (e) =>{
        e.stopPropagation()
    }


    render(){
        const {
            oneBtn,
            content,
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
            onTouchOutside,
        } = this.props

        return (
            <div className={cx("modal")}
                onClick={onTouchOutside}>
                <div 
                    className={cx("wrapper")}
                    onClick={this.handleStopEvent}>
                        <pre className={cx("content")}>
                            {content}
                        </pre>

                    <div className={cx("control")}>
                        <div className={cx("btn", "positive")}
                            onClick={onConfirm}>
                            {confirmText}
                        </div>

                        {!oneBtn && (
                            <div className={cx("btn", "negative")}
                                onClick={onCancel}>
                                {cancelText}
                            </div>
                        )}
                    </div>    
                </div>
            </div>
        )
    }
}

export default Modal;