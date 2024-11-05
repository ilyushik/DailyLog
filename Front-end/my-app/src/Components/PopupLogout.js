import {Fragment} from "react";
import "./PopupLogout.css"
import {useSelector} from "react-redux";
import logout_icon from "../images/logout.svg";

export function PopupLogout(props) {
    const mode = useSelector(state => state.mode);

    const logout = () => {
        localStorage.removeItem("token");
        props.close()
        window.location.reload();
    }

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "Dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <div className="logout-block">
                            <img className="logout-image" src={logout_icon} alt="" />

                            <div className="text-block">
                                <p className={`title ${mode === "Light" ? "light" : "dark"}`}>Do you really want to go out</p>
                            </div>

                            <div className={`logout-buttons`}>
                                <button onClick={props.close} className={`logout_button_no`}>No</button>
                                <button onClick={logout} className={`logout_button_yes`}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}