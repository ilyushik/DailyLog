import {Fragment, useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import "./PopupReport.css"
import axios from "axios";

export function PopupReport(props) {
    const mode = useSelector((state) => state.mode)
    const [reportDate, setReportDate] = useState("");
    const [reportText, setReportText] = useState("");
    const [reportHours, setReportHours] = useState(0);
    const [isFormValid, setIsFormValid] = useState(true);
    const [errors, setErrors] = useState({});
    const [requests, setRequests] = useState({});

    const fetchRequestHandler = useCallback(async () => {
        if (props.report?.request) { // Проверка на существование props.report и props.report.request
            try {
                const response = await axios.get(`http://localhost:8080/requests/request/${props.report.request}`, {
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
            const response = await axios.post("http://localhost:8080/report/add-report", {
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
                <div className={`modal-justify ${mode === "Dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "Dark" ? "dark" : "light"}`}>
                        <button
                            className={`close-button ${mode === "Dark" ? "dark" : "light"}`}
                            onClick={props.closeModal}>&times;</button>
                        <div className="report-block">
                            {props.report && (
                                <div>
                                    {props.report.request !== null ? (
                                        <div>
                                            <p className={`title-report-block ${mode === "Dark" ? "dark" : "light"}`}>Info about request</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className={`title-report-block ${mode === "Dark" ? "dark" : "light"}`}>Info about report</p>
                                            <p>{props.report.date[0]}-{props.report.date[1]}-{props.report.date[2]}</p>
                                            <p>{props.report.text}</p>
                                            <p>{props.report.status}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!props.report && (
                                <div>
                                    <p className={`title-report-block ${mode === "Dark" ? "dark" : "light"}`}>Add a report</p>
                                    <form onSubmit={submitHandler}>
                                        <div className={`report-date-block ${mode === "Dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-date">Date</label>
                                            <input id="report-date" type="date" value={reportDate} onChange={dateHandler}/>
                                        </div>
                                        {errors.date && <p className="error-message">{errors.date}</p>}

                                        <div className={`report-hours-block ${mode === "Dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-hours">Amount of hours</label>
                                            <input id="report-hours" type="number" value={reportHours} onChange={hoursHandler}/>
                                        </div>
                                        {errors.hours && <p className="error-message">{errors.hours}</p>}

                                        <div className={`report-text-block ${mode === "Dark" ? "dark" : "light"}`}>
                                            <label htmlFor="report-text">Comment</label>
                                            <textarea id="report-text" value={reportText} onChange={textHandler}/>
                                        </div>
                                        {errors.text && <p className="error-message">{errors.text}</p>}
                                        {errors.message && <p className="error-message">{errors.message}</p>}

                                        <div className={`report-buttons-block ${mode === "Dark" ? "dark" : "light"}`}>
                                            <button className={`report-button-create ${mode === "Dark" ? "dark" : "light"}`}>Create</button>
                                            <button
                                                type="button"
                                                className={`report-button-cancel ${mode === "Dark" ? "dark" : "light"}`}
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
