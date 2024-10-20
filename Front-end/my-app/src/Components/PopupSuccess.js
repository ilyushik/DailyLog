import {Fragment} from "react";
import "./PopupSuccess.css"
import {useSelector} from "react-redux";
import success_icon from "../images/success_icon_popup.svg";

export function PopupSuccess(props) {
    const mode = useSelector(state => state.mode);

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "Dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <div className="success-block">
                            <img className="success-image" src={success_icon} alt="success icon" />

                            <div className="text-block">
                                <p className={`title ${mode === "Light" ? "light" : "dark"}`}>The request was
                                    successfully sent!</p>
                                <p className={`message ${mode === "Light" ? "light" : "dark"}`}>Wait for a message
                                    confirming your request</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}