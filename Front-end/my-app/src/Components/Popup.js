import ReactDOMServer from 'react-dom/server';
import {Fragment, useState, useEffect, useCallback} from "react";
import "./Popup.css"
import {useSelector} from "react-redux";
import axios from "axios";
import {Email} from "../emails/Email.tsx";

export function Popup(props) {
    const mode = useSelector(state => state.theme.theme);
    const [reason, setReason] = useState("Annual Leave");
    const [startDate, setStartDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [comment, setComment] = useState("");
    const [reasons, setReasons] = useState([]);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(true);


    const handleSendEmail = async (email, message, link, buttonText, emailTitle) => {
        const htmlContent = ReactDOMServer.renderToString(
            <Email message={message} link={link} buttonText={buttonText} />
        )

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/api/send-email`,
                {
                    html: htmlContent,
                    userEmail: email,
                    emailTitle: emailTitle,
                }
            )
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
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
        setFinishDate(e.target.value);
    }

    const commentHandler = (e) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (startDate.trim().length === 0 || finishDate.trim().length === 0) {
            setIsFormValid(false);
            setErrors({errorDate: "Date should not be empty"})
            return;
        }

        const request = {reason: reason, startDate: startDate, finishDate: finishDate}
        console.log(request)

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/addRequest`,
                {reason: reason, startDate: startDate, finishDate: finishDate, comment: comment},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            console.log(response.data)

            if (response.status !== 400) {
                props.close()
                props.openLoad()

                handleSendEmail(response.data.userEmail, "Your request has been received!",
                    `${process.env.REACT_APP_FRONTEND_LINK}/my-info`, "Back to requests",
                    "New Request")


                await delay(1500)

                if (response.data.firstApproverEmail !== null) {
                    handleSendEmail(response.data.firstApproverEmail, "You have new request",
                        `${process.env.REACT_APP_FRONTEND_LINK}/inbox`, "Back to requests",
                        "New Request")
                }
                await delay(1500)
                if (response.data.secondApproverEmail !== null) {
                    handleSendEmail(response.data.secondApproverEmail, "You have new request",
                        `${process.env.REACT_APP_FRONTEND_LINK}/inbox`, "Back to requests",
                        "New Request")
                }
                await delay(1500)
                if (response.data.thirdApproverEmail !== null) {
                    handleSendEmail(response.data.thirdApproverEmail, "You have new request",
                        `${process.env.REACT_APP_FRONTEND_LINK}/inbox`, "Back to requests",
                        "New Request")
                }

                props.closeLoad()
            }
            props.openSuccess()

        } catch (error) {
            console.log(error.response.data)
            setErrors(error.response.data)
        }
    }


    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify-add ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen-add ${mode === "dark" ? "dark" : "light"}`}>
                        <button className={`close-button-add ${mode === "dark" ? "dark" : "light"}`} onClick={props.close}>
                            &times;</button>
                        <p className="title-add">Create a request</p>
                        <form onSubmit={submitHandler}>
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