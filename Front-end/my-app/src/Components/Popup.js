import {Fragment, useState, useEffect, useCallback} from "react";
import "./Popup.css"
import {useSelector} from "react-redux";
import axios from "axios";

export function Popup(props) {
    const mode = useSelector(state => state.mode);
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [comment, setComment] = useState("");
    const [reasons, setReasons] = useState([]);

    const fetchReasonsHandler = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/reasons",{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            console.log(response.data)
            setReasons(response.data)
        } catch (error) {
            console.log(error.response.data)
        }
    }, [])

    useEffect(() => {
        fetchReasonsHandler();
    }, [fetchReasonsHandler])

    const reasonHandler = (e) => {
        e.preventDefault();
        setReason(e.target.value);
    }

    const startDateHandler = (e) => {
        e.preventDefault();
        setStartDate(e.target.value);
    }

    const endDateHandler = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
    }

    const commentHandler = (e) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const calculateDifference = (startDate, endDate) => {
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const timeDifference = Math.abs(secondDate - firstDate);
        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return 1
        }

        if (days === 1) {
            return 1
        }

        return days;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        props.close()
        props.openSuccess()

        const request = {
            reason: reason,
            startDate: startDate,
            endDate: endDate,
            comment: comment,
            countOfDays: calculateDifference(startDate, endDate),
        }

        console.log(request);
    }


    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "Dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <p className="title">Create a request</p>
                        <form onSubmit={submitHandler}>
                            <div className="select-wrapper">
                                <select className={`select ${mode === "Dark" ? "dark" : "light"}`} name="reasons"
                                        id="reasons" value={reason} onChange={reasonHandler}>
                                    {/*<option value="vacation">Vacation</option>*/}
                                    {/*<option value="Sick Leave">Sick Leave</option>*/}
                                    {/*<option value="Time off">Time off</option>*/}
                                    {/*<option value="Business trip">Business trip</option>*/}
                                    {reasons.map((reason) => (
                                        <option key={reason.id} value={reason.reason}>{reason.reason}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="block">
                                <div className="date-block">
                                    <div className={`date-input ${mode === "Dark" ? "dark" : "light"}`}>
                                        <label htmlFor="start">Start</label>
                                        <input className={`date-field ${mode === "Dark" ? "dark" : "light"}`} id="start" type={"date"} value={startDate} onChange={startDateHandler}/>
                                    </div>

                                    <div className="line-block">
                                        <div className="line"></div>
                                    </div>

                                    <div className={`date-input ${mode === "Dark" ? "dark" : "light"}`}>
                                        <label htmlFor="end">End</label>
                                        <input className={`date-field ${mode === "Dark" ? "dark" : "light"}`} id="end" type={"date"} value={endDate} onChange={endDateHandler}/>
                                    </div>
                                </div>
                            </div>

                            <div className={`comment-block ${mode === "Dark" ? "dark" : "light"}`}>
                                <label htmlFor="comment">Comment</label>
                                <textarea className={`comment-area ${mode === "Dark" ? "dark" : "light"}`} id="comment" value={comment} placeholder={"Write something..."} onChange={commentHandler}/>
                            </div>

                            <div className="buttons-block">
                                <div className="create-block">
                                    <button type={"submit"} className="create-button">Create</button>
                                </div>

                                <div className="cancel-block">
                                    <button type={"button"} className="cancel-button" onClick={props.close}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}