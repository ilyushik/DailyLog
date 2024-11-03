import {Fragment} from "react";
import {useSelector} from "react-redux";
import "./PopupReport.css"

export function PopupReport(props) {
    const mode = useSelector((state) => state.mode)
    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.closeModal}>

                </div>

                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "Dark" ? "dark" : "light"}`} onClick={props.closeModal}>&times;</button>
                        <div className="report-block">
                            {props.report && <div>
                                <p>{props.report.date[0]}-{props.report.date[1]}-{props.report.date[2]}</p>
                                <p>{props.report.text}</p>
                                <p>{props.report.status}</p>
                            </div>}
                            {!props.report && <div>
                                <p>Add a report</p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}