import {Fragment, useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import "./PopupReport.css"
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import {Email} from "../emails/Email.tsx";
import { LuBrainCircuit } from "react-icons/lu";

export function PopupReport(props) {
    const mode = useSelector(state => state.theme.theme);
    const [reportDate, setReportDate] = useState("");
    const [reportText, setReportText] = useState("");
    const [reportHours, setReportHours] = useState("");
    const [isFormValid, setIsFormValid] = useState(true);
    const [errors, setErrors] = useState({});
    const [requests, setRequests] = useState({});

    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const [formValue, setFormValue] = useState('Add');

    const [date, setDate] = useState('');
    const [countOfHours, setCountOfHours] = useState(0);
    const [comment, setComment] = useState('');

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length !== 3) return "";
        const [year, month, day] = dateArray;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };

    const formatSelectedFromReportDate = (date) => {
        const reportDateObj = new Date(date);

        const year = reportDateObj.getFullYear();
        const month = String(reportDateObj.getMonth() + 1).padStart(2, '0');
        const day = String(reportDateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`
    }

    const initialiseData = () => {
        setDate(formatDate(props.report?.date))
        setReportDate(formatSelectedFromReportDate(props?.selectedDate))
        setCountOfHours(props.report?.countOfHours)
        setComment(props.report?.text)
    }

    useEffect(() => {
        initialiseData()
    }, [])

    const fetchRequestHandler = useCallback(async () => {
        if (props.report?.request) { // Проверка на существование props.report и props.report.request
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/requests/request/${props.report.request}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
                console.log(response.data);
                setRequests(response.data);
            } catch (error){
                console.log(error.response?.data || "Error fetching request");
            }
        }
    }, [props.report?.request]);

    useEffect(() => {
        if (props.report) {
            fetchRequestHandler();
        }
    }, [fetchRequestHandler, props.report]);

    const updateDateHandler = (e) => {
        e.preventDefault();
        setDate(e.target.value);
    }

    const updateCountOfHoursHandler = (e) => {
        e.preventDefault();
        setCountOfHours(e.target.value);
    }

    const updateCommentHandler = (e) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const dateHandler = (event) => {
        setReportDate(event.target.value);
    };

    const textHandler = (event) => {
        setReportText(event.target.value);
    };

    const hoursHandler = (event) => {
        setReportHours(Number(event.target.value));
    };

    const handleSendEmail = async (email, message, link, buttonText) => {
        const htmlContent = ReactDOMServer.renderToString(<Email message={message} link={link} buttonText={buttonText} />)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/api/send-email`, {
                html: htmlContent,
                userEmail: email,
            })
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        if (reportDate.trim().length <= 1) {
            setErrors({date: "Date should not be empty"})
            return
        }
        if (reportText.trim().length <= 1) {
            setErrors({text: "Text should not be empty"})
            return
        }
        if (reportHours < 1) {
            setErrors({hours: "Hours should be more than 0"})
            return
        }

        setIsFormValid(Object.keys(errors).length === 0);

        if (!isFormValid) {
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/report/add-report`, {
                date: reportDate,
                text: reportText,
                countOfHours: reportHours
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            console.log(response.data);
            if (response.data.days === 20) {
                handleSendEmail(response.data.userEmail, "You have already 20 days for vacation. Take a break for 🏝️",
                    `${process.env.REACT_APP_FRONTEND_LINK}/my-info`, "Back to main page")
            }
            props.closeModal && props.closeModal();
            props.openSuccess && props.openSuccess();
        } catch (error) {
            setErrors(error.response?.data || { message: "Error submitting report" });
            console.log(error.response?.data || "Error submitting report");
        }
    };

    const updateHandler = async (e) => {
        e.preventDefault();

        if (date.trim().length < 1) {
            setErrors({date: 'Date should not be empty'});
            return;
        }
        if (countOfHours < 1) {
            setErrors({countOfHours: 'Amount of hours should not be empty'});
            return
        }
        if (countOfHours > 8) {
            setErrors({countOfHours: 'Amount of hours should not be more than 8 hours'});
            return
        }
        if (comment.trim().length < 1) {
            setErrors({comment: 'Comment should not be empty'});
            return
        }

        const updatedReport = {
            id: props.report?.id,
            date: date,
            countOfHours: countOfHours,
            text: comment,
        }

        console.log(updatedReport);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/report/update/${props.report.id}`, updatedReport, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            console.log(response.data)

            props.closeModal()
            window.location.reload()
        } catch (e) {
            console.log(e.response?.data);
            setErrors(e.response?.data);
        }
    }

    const deleteReportHandler = async () => {
        const updatedReport = {
            id: props.report?.id,
            date: date,
            countOfHours: countOfHours,
            comment: comment,
        }

        console.log(updatedReport);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/report/delete`, props.report.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data)

            props.closeModal()
            window.location.reload();
        } catch (e) {
            console.log(e.response?.data);
            setErrors(e.response?.data)
        }
    }

    const generateReport = async () => {
        try {
            setIsAiGenerating(true);
            const response = await
                axios.get(`${process.env.REACT_APP_BACKEND_LINK}/deepseek/generate-report?tasks=${reportText}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
            console.log(response.data)
            setReportText(response.data)
            setIsAiGenerating(false);
        } catch (e) {
            console.log(e.response?.data);
        }
    }


    return (
        <Fragment>
            <div>
                <div className="back" onClick={props.closeModal} />
                <div className={`modal-justify-report ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen-report ${mode === "dark" ? "dark" : "light"}`}>
                        <button
                            className={`close-button-report ${mode === "dark" ? "dark" : "light"}`}
                            onClick={props.closeModal}>&times;</button>
                        <div className="report-block">
                            {props.report && (
                                <div>
                                    {props.report.request !== null ? (
                                        <div>
                                            <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Info about request</p>
                                            <div className={`request-info-block`}>
                                                <div
                                                    className={`request-info-block-reason-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Reason:</p>
                                                    <p>{requests.reason}</p>
                                                </div>

                                                <div
                                                    className={`request-info-block-startDate-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Start:</p>
                                                    {requests.startDate && requests.startDate.length >= 3 && (
                                                        <p>{requests.startDate[0]}-{requests.startDate[1]}-{requests.startDate[2]}</p>
                                                    )}
                                                </div>

                                                <div
                                                    className={`request-info-block-endDate-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>End:</p>
                                                    {requests.finishDate && requests.finishDate.length >= 3 && (
                                                        <p>{requests.finishDate[0]}-{requests.finishDate[1]}-{requests.finishDate[2]}</p>
                                                    )}
                                                </div>


                                                <div className={`request-info-block-comment-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p className={`request-info-block-comment-block-title ${mode === "dark" ? "dark" : "light"}`}>Comment:</p>
                                                    <div className={`request-title-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p className={`request-info-block-comment-block-data ${mode === "dark" ? "dark" : "light"}`}>{requests.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (<>
                                        {formValue === 'Update' ? (
                                            <>
                                                <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Update a report</p>
                                                <form onSubmit={updateHandler}>
                                                    <div className={`report-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <label htmlFor="update-date">Date</label>
                                                        <input id="update-date" type="date" value={date}
                                                               onChange={updateDateHandler}/>
                                                    </div>
                                                    {errors.date && <p className="error-message">{errors.date}</p>}

                                                    <div className={`report-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <label htmlFor="update-hours">Amount of hours</label>
                                                        <input id="update-hours" type="number" value={countOfHours}
                                                               onChange={updateCountOfHoursHandler}/>
                                                    </div>
                                                    {errors.countOfHours && <p className="error-message">{errors.countOfHours}</p>}

                                                    <div className={`report-text-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <label htmlFor="update-text">Comment</label>
                                                        <textarea id="update-text" value={comment} onChange={updateCommentHandler}/>
                                                    </div>
                                                    {errors.comment && <p className="error-message">{errors.text}</p>}
                                                    {errors.message && <p className="error-message">{errors.message}</p>}

                                                    <div className={`report-buttons-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <button className={`report-button-create ${mode === "dark" ? "dark" : "light"}`}>Update</button>
                                                        <button
                                                            type="button"
                                                            className={`report-button-cancel ${mode === "dark" ? "dark" : "light"}`}
                                                            onClick={props.closeModal}>Cancel</button>
                                                    </div>
                                                </form>
                                            </>
                                        ) : (
                                            <div>
                                                <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Info about report</p>
                                                <div className={`report-info-block`}>
                                                    <div
                                                        className={`report-info-block-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p>Date:</p>
                                                        {props.report.date && props.report.date.length >= 3 && (
                                                            <p>{props.report.date[0]}-{props.report.date[1]}-{props.report.date[2]}</p>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={`report-info-block-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p>Hours:</p>
                                                        {props.report.countOfHours && (
                                                            <p>{props.report.countOfHours}</p>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={`request-info-block-comment-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p className={`request-info-block-comment-block-title ${mode === "dark" ? "dark" : "light"}`}>Comment:</p>
                                                        <div className={`request-title-block ${mode === "dark" ? "dark" : "light"}`}>
                                                            <p className={`request-info-block-comment-block-data`}>{props.report.text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!props.param && (
                                                    <div className="report-action-buttons">
                                                        <button className="report-action-buttons-update" onClick={() => setFormValue('Update')}>Update</button>
                                                        <button className="report-action-buttons-delete" onClick={deleteReportHandler}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        </>)}
                                </div>
                            )}
                            {!props.report && (
                                <div>
                                    <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Add a report</p>
                                    <form onSubmit={submitHandler}>
                                        <div className={`report-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-date">Date</label>
                                            <input id="report-date" type="date" value={reportDate}
                                                   onChange={dateHandler}/>
                                        </div>
                                        {errors.date && <p className="error-message">{errors.date}</p>}

                                        <div className={`report-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-hours">Amount of hours</label>
                                            <input id="report-hours" type="number" value={reportHours}
                                                   onChange={hoursHandler}/>
                                        </div>
                                        {errors.hours && <p className="error-message">{errors.hours}</p>}

                                        <div className={`report-text-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-text">Comment</label>
                                            <textarea id="report-text" value={reportText} onChange={textHandler}/>
                                        </div>
                                        {errors.text && <p className="error-message">{errors.text}</p>}
                                        {errors.message && <p className="error-message">{errors.message}</p>}
                                        {isAiGenerating && <p className="error-message">loading...</p>}

                                        <div className="ai-button-block">
                                            <button className={`ai-button ${isAiGenerating ? "disable" : ""}`}
                                                    onClick={generateReport} disabled={isAiGenerating}>
                                                Generate report with AI<LuBrainCircuit className="ai-icon"/></button>
                                        </div>

                                        <div className={`report-buttons-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <button
                                                className={`report-button-create ${mode === "dark" ? "dark" : "light"} 
                                            ${isAiGenerating ? "disable" : ""}`}>Create</button>
                                            <button
                                                type="button"
                                                className={`report-button-cancel ${mode === "dark" ? "dark" : "light"} 
                                                ${isAiGenerating ? "disable" : ""}`}
                                                onClick={props.closeModal}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
