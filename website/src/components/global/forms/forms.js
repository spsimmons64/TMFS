import "./forms.css"
import Preloader from "../../../assets/images/preloader_128.gif";
import { Form } from "react-router-dom";


export const ModalFormHeader = (props) => {
    const { busy, title, ...nprops } = props;
    return (

        <div className="div-modal-form-header">
            <div className="div-modal-form-header-title"><h2>{title}</h2></div>
            <div className="div-modal-form-header-icon">
                {busy ? <img src={Preloader} alt="Processing" style={{ height: "38px" }} /> : <></>}
            </div>

        </div>

    )
}

export const ModalFormFooter = (props) => {
    const { busy, children, style, ...nprops } = props;
    return (
        <div className="div-modal-form-footer">
            <fieldset className="fs-modal-form-footer-inner" style={style} disabled={busy}>
                {children}
            </fieldset>
        </div>
    )
}

export const ModalFormBody = (props) => {
    const { busy, children, id, ...nprops } = props;
    return (
        <div className="div-modal-form-body">
            <fieldset id={id} className="fs-modal-form-body-inner" disabled={busy} {...nprops}>
                {children}
            </fieldset>
        </div>
    )
}

export const ModalFormBodyScroll = (props) => {
    const { busy, children, id, ...nprops } = props;
    return (
        <div className="div-modal-form-body-scroller-container">
            <div className="div-modal-form-body-scroller">
                <fieldset id={id} className="fs-modal-form-body-inner" disabled={busy}>
                    {children}
                </fieldset>
            </div>
        </div>
    )
}

export const ModalForm = (props) => {
    const { id, width, height, busy, style, children, ...nprops } = props
    let newStyle = Object.assign({ width: width || "auto", height: height || "auto" }, style || {})
    return (
        <div className="div-modal-form-wrapper">
            <div className="div-modal-form-container" style={newStyle}>
                {children}
            </div>
        </div>
    )
}
export const ModalFormScroll = (props) => {
    const { id, width, height, busy, style, children, ...nprops } = props
    let newStyle = Object.assign({ width: width || "auto", minHeight: height || "auto" }, style || {})
    return (
        <div className="div-modal-form-wrapper">
            <div className="div-modal-scroll-form-container" style={newStyle}>
                {children}
            </div>
        </div>
    )
}

export const FormSection = (props) => {
    const { style, children, ...nprops } = props
    return (
        <section className="form-section" style={style} {...nprops}>
            {children}
        </section>
    )
}

export const FormQualification = (props) => {
    const { style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section" style={style}>{children}</div>)
}
export const FormQualificationHeader = (props) => {
    const { title, style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section-header" style={style}>{title}</div>)
}
export const FormQualificationData = (props) => {
    const { style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section-data" style={style}>{children}</div>)
}
export const FormQualificationDataIcon = (props) => {
    const { style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section-data-icon" style={style}>{children}</div>)
}
export const FormQualificationDataIconLeft = (props) => {
    const { style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section-data-icon-left" style={style}>{children}</div>)
}
export const FormQualificationDataIconRight = (props) => {
    const { style, children, ...nprops } = props
    return (<div {...nprops} className="form-qualification-section-data-icon-right" style={style}>{children}</div>)
}
