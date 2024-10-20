import {Fragment} from "react";
import "./Popup.css"
import {useSelector} from "react-redux";

export function Popup(props) {
    const mode = useSelector(state => state.mode);

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "Dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <p className="title">Create a request</p>
                        <form>
                            <div className="select-wrapper">
                                <select className={`select ${mode === "Dark" ? "dark" : "light"}`} name="reasons"
                                        id="reasons">
                                    <option value="vacation">Vacation</option>
                                    <option value="sick_leave">Sick Leave</option>
                                    <option value="time_off">Time off</option>
                                    <option value="business_trip">Business trip</option>
                                </select>
                            </div>

                            <div className="block">
                                <div className="date-block">
                                    <div className={`date-input ${mode === "Dark" ? "dark" : "light"}`}>
                                        <label htmlFor="start">Start</label>
                                        <input id="start" type={"date"} value=""/>
                                    </div>

                                    <div className="line-block">
                                        <div className="line"></div>
                                    </div>

                                    <div className={`date-input ${mode === "Dark" ? "dark" : "light"}`}>
                                        <label htmlFor="end">End</label>
                                        <input id="end" type={"date"} value=""/>
                                    </div>
                                </div>
                            </div>

                            <div className={`comment-block ${mode === "Dark" ? "dark" : "light"}`}>
                                <label htmlFor="comment">Comment</label>
                                <textarea id="comment" value="" placeholder={"Write something..."}/>
                            </div>

                            <div className="buttons-block">
                                <div className="create-block">
                                    <button className="create-button" onClick={props.close}>Create</button>
                                </div>

                                <div className="cancel-block">
                                    <button className="cancel-button" onClick={props.close}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}