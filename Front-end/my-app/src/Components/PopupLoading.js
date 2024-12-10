import {Fragment} from "react";
import "./PopupSuccess.css"
import {useSelector} from "react-redux";

export function PopupLoading(props) {
    const mode = useSelector(state => state.theme.theme);

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "dark" ? "dark" : "light"}`}>
                        <div className="success-block">
                            <div className="loading-circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}