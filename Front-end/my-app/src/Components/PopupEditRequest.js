import "./Popup.css"
import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";

export default function PopupEditRequest(props) {
    const request = props.request;
    const mode = useSelector(state => state.theme.theme);

    const [reasons, setReasons] = useState([]);

    const [errors, setErrors] = useState({});

    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [comment, setComment] = useState("");

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length !== 3) return "";
        const [year, month, day] = dateArray;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };


    const initializeValuesHandler = () => {

        console.log("Request", request);

        setReason(request.reason);
        setStartDate(formatDate(request.startDate));
        setFinishDate(formatDate(request.finishDate));
        setComment(request.comment);
    }

    const fetchReasonsHandler = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/reasons`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            console.log(response.data)
            setReasons(response.data)
        } catch (error) {
            console.log(error.response?.data)
        }
    }, [])

    useEffect(() => {
        fetchReasonsHandler();
    }, [])

    useEffect(() => {
        initializeValuesHandler();
    }, [])


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
        setFinishDate(e.target.value);
    }

    const commentHandler = (e) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const submitEditHandler = async (e) => {
        e.preventDefault()

        if (startDate.trim().length === 0 || finishDate.trim().length === 0) {
            setErrors({errorDate: "Date should not be empty"})
            return;
        }
        if (reason.trim().length === 0) {
            setErrors({reason: "Reason should not be empty"})
            return;
        }
        if (comment.trim().length === 0) {
            setErrors({comment: "Reason should not be empty"})
            return;
        }

        const outputRequest = {
            reason: reason,
            startDate: startDate,
            finishDate: finishDate,
            comment: comment,
        }

        console.log(outputRequest);

        try {
            const response =
                await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/requests/update/${request.id}`, outputRequest,
                    {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
            console.log(response.data)

            props.close()
            window.location.reload();
        } catch (e) {
            console.log(e.response.data);
            setErrors(e.response.data)
        }
    }

    return (
        <>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify-add ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen-add ${mode === "dark" ? "dark" : "light"}`}>
                        <button className={`close-button-add ${mode === "dark" ? "dark" : "light"}`} onClick={props.close}>
                            &times;</button>
                        <p className="title-add">Edit a request</p>
                        <form onSubmit={submitEditHandler}>
                            <div className="select-wrapper">
                                <select className={`select ${mode === "dark" ? "dark" : "light"}`} name="reasons"
                                        id="reasons" value={reason} onChange={reasonHandler}>
                                    {reasons.map((reason) => (
                                        <option key={reason.id} value={reason.reason}>{reason.reason}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="block">
                                <div className="date-block">
                                    <div className={`date-input ${mode === "dark" ? "dark" : "light"}`}>
                                        <label htmlFor="start">Start</label>
                                        <input className={`date-field ${mode === "dark" ? "dark" : "light"}`} id="start"
                                               type={"date"} value={startDate} onChange={startDateHandler}/>
                                    </div>

                                    <div className="line-block">
                                        <div className="line"></div>
                                    </div>

                                    <div className={`date-input ${mode === "dark" ? "dark" : "light"}`}>
                                        <label htmlFor="end">End</label>
                                        <input className={`date-field ${mode === "dark" ? "dark" : "light"}`} id="end"
                                               type={"date"} value={finishDate} onChange={endDateHandler}/>
                                    </div>
                                </div>
                            </div>
                            {errors.errorDate && <p className={`errorDate-message`}>{errors.errorDate}</p>}

                            <div className={`comment-block ${mode === "dark" ? "dark" : "light"}`}>
                                <label htmlFor="comment">Comment</label>
                                <textarea className={`comment-area ${mode === "dark" ? "dark" : "light"}`} id="comment"
                                          value={comment} placeholder={"Write something..."} onChange={commentHandler}/>
                                {errors.comment && <p className={`comment-message`}>{errors.comment}</p>}
                            </div>

                            <div className="buttons-block">
                                <div className="create-block">
                                    <button type={"submit"} className="create-button">Update</button>
                                </div>

                                <div className="cancel-block">
                                    <button type={"button"} className="cancel-button" onClick={props.close}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}