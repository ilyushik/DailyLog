import {Fragment} from "react";
import "./PopupSuccess.css"
import {useSelector} from "react-redux";
import success_icon from "../images/success_icon_popup.svg";

export function PopupSuccess(props) {
    const mode = useSelector(state => state.theme.theme);

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <div className="success-block">
                            <img className="success-image" src={success_icon} alt="success icon" />

                            <div className="text-block">
                                <p className={`title ${mode === "light" ? "light" : "dark"}`}>{props.title}</p>
                                <p className={`message ${mode === "light" ? "light" : "dark"}`}>{props.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}