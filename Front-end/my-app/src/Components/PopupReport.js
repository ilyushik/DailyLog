import {Fragment, useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import "./PopupReport.css"
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import {Email} from "../emails/Email.tsx";

export function PopupReport(props) {
    const mode = useSelector(state => state.theme.theme);
    const [reportDate, setReportDate] = useState("");
    const [reportText, setReportText] = useState("");
    const [reportHours, setReportHours] = useState(0);
    const [isFormValid, setIsFormValid] = useState(true);
    const [errors, setErrors] = useState({});
    const [requests, setRequests] = useState({});

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

        // Валидация данных
        const newErrors = {};
        if (reportDate.trim().length <= 1) {
            newErrors.date = "Date should not be empty";
        }
        if (reportText.trim().length <= 1) {
            newErrors.text = "Text should not be empty";
        }
        if (reportHours < 1) {
            newErrors.hours = "Hours should be more than 0";
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);

        if (!isFormValid) {
            return;
        }

        // Если форма валидна, отправляем данные
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
            props.closeModal && props.closeModal();  // Проверка на существование функции
            props.openSuccess && props.openSuccess();
        } catch (error) {
            setErrors(error.response?.data || { message: "Error submitting report" });
            console.log(error.response?.data || "Error submitting report");
        }
    };


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
                                    ) : (
                                        <div>
                                            <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Info
                                                about report</p>
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
                                        </div>
                                    )}
                                </div>
                            )}
                            {!props.report && (
                                <div>
                                    <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Add a
                                        report</p>
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

                                        <div className={`report-buttons-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <button className={`report-button-create ${mode === "dark" ? "dark" : "light"}`}>Create</button>
                                            <button
                                                type="button"
                                                className={`report-button-cancel ${mode === "dark" ? "dark" : "light"}`}
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
