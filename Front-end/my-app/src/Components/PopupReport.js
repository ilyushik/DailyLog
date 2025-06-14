import React, { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import "./PopupReport.css";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { Email } from "../emails/Email.tsx";
import { LuBrainCircuit, LuMic } from "react-icons/lu";

function AudioRecorder({ onRecordingComplete, disabled }) {
    const [recording, setRecording] = useState(false);
    const [recordingError, setRecordingError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            setRecordingError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                onRecordingComplete(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            console.error('Recording error:', err);
            setRecordingError(err.name === 'NotAllowedError'
                ? 'Microphone access denied. Please allow microphone permissions.'
                : 'Failed to start recording');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="voice-controls">
            <button
                className={`voice-button ${recording ? 'recording' : ''}`}
                onClick={recording ? stopRecording : startRecording}
                disabled={disabled}
            >
                {recording ? "Stop Recording" : "Record Voice"} <LuMic className="voice-icon" />
            </button>
            {recordingError && <div className="error-message">{recordingError}</div>}
        </div>
    );
}

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
    const [isAudioProcessing, setIsAudioProcessing] = useState(false);

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
        return `${year}-${month}-${day}`;
    };

    const initialiseData = () => {
        setDate(formatDate(props.report?.date))
        setReportDate(formatSelectedFromReportDate(props?.selectedDate))
        setCountOfHours(props.report?.countOfHours)
        setComment(props.report?.text)
    };

    useEffect(() => {
        initialiseData();
    }, []);

    const fetchRequestHandler = useCallback(async () => {
        if (props.report?.request) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/requests/request/${props.report.request}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.log(error.response?.data || "Error fetching request");
            }
        }
    }, [props.report?.request]);

    useEffect(() => {
        if (props.report) {
            fetchRequestHandler();
        }
    }, [fetchRequestHandler, props.report]);

    const handleVoiceRecording = async (blob) => {
        setIsAudioProcessing(true);
        setErrors(prev => ({...prev, voice: null}));

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const formData = new FormData();
            formData.append("file", blob, "recording.wav");

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_LINK}/chat-gpt/transcribe`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            setReportText(prev => prev ? `${prev}\n${response.data}` : response.data);
            if (errors.text) {
                setErrors(null)
            }
        } catch (err) {
            console.error("Voice processing error:", err);
            setErrors(prev => ({
                ...prev,
                voice: err.response?.status === 403
                    ? "You don't have permission to use this feature"
                    : "Failed to process voice recording"
            }));
        } finally {
            setIsAudioProcessing(false);
        }
    };

    const dateHandler = (event) => {
        setReportDate(event.target.value);
    };

    const textHandler = (event) => {
        setReportText(event.target.value);
    };

    const hoursHandler = (event) => {
        setReportHours(Number(event.target.value));
    };

    const updateDateHandler = (e) => {
        e.preventDefault();
        setDate(e.target.value);
    };

    const updateCountOfHoursHandler = (e) => {
        e.preventDefault();
        setCountOfHours(e.target.value);
    };

    const updateCommentHandler = (e) => {
        e.preventDefault();
        setComment(e.target.value);
    };

    const handleSendEmail = async (email, message, link, buttonText) => {
        const htmlContent = ReactDOMServer.renderToString(
            <Email message={message} link={link} buttonText={buttonText} />
        );

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/api/send-email`, {
                html: htmlContent,
                userEmail: email,
            });
        } catch (error) {
            console.log(error);
        }
    };

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

        const newErrors = {};
        if (!date) newErrors.date = 'Date is required';
        if (!countOfHours || countOfHours < 1) newErrors.countOfHours = 'At least 1 hour required';
        if (countOfHours > 8) newErrors.countOfHours = 'Maximum 8 hours allowed';
        if (!comment) newErrors.comment = 'Comment is required';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const updatedReport = {
            id: props.report?.id,
            date,
            countOfHours,
            text: comment,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_LINK}/report/update/${props.report.id}`,
                updatedReport,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            props.closeModal?.();
            window.location.reload();
        } catch (error) {
            setErrors(error.response?.data || { message: "Update failed" });
            console.error("Update error:", error.response?.data || error);
        }
    };

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
                            onClick={props.closeModal}
                        >
                            &times;
                        </button>

                        <div className="report-block">
                            {props.report ? (
                                <div>
                                    {props.report.request !== null ? (
                                        <div>
                                            <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Info about request</p>
                                            <div className={`request-info-block`}>
                                                <div className={`request-info-block-reason-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Reason:</p>
                                                    <p>{requests.reason}</p>
                                                </div>

                                                <div className={`request-info-block-startDate-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Start:</p>
                                                    {requests.startDate?.length >= 3 && (
                                                        <p>{requests.startDate[0]}-{requests.startDate[1]}-{requests.startDate[2]}</p>
                                                    )}
                                                </div>

                                                <div className={`request-info-block-endDate-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>End:</p>
                                                    {requests.finishDate?.length >= 3 && (
                                                        <p>{requests.finishDate[0]}-{requests.finishDate[1]}-{requests.finishDate[2]}</p>
                                                    )}
                                                </div>

                                                <div className={`request-info-block-comment-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p className={`request-info-block-comment-block-title ${mode === "dark" ? "dark" : "light"}`}>Comment:</p>
                                                    <div className={`request-title-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p className={`request-info-block-comment-block-data ${mode === "dark" ? "dark" : "light"}`}>
                                                            {requests.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : formValue === 'Update' ? (
                                        <>
                                            <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Update a report</p>
                                            <form onSubmit={updateHandler}>
                                                <div className={`report-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <label htmlFor="update-date">Date</label>
                                                    <input
                                                        id="update-date"
                                                        type="date"
                                                        value={date}
                                                        onChange={updateDateHandler}
                                                    />
                                                </div>
                                                {errors.date && <p className="error-message">{errors.date}</p>}

                                                <div className={`report-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <label htmlFor="update-hours">Amount of hours</label>
                                                    <input
                                                        id="update-hours"
                                                        type="number"
                                                        min="1"
                                                        max="8"
                                                        value={countOfHours}
                                                        onChange={updateCountOfHoursHandler}
                                                    />
                                                </div>
                                                {errors.countOfHours && <p className="error-message">{errors.countOfHours}</p>}

                                                <div className={`report-text-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <label htmlFor="update-text">Comment</label>
                                                    <textarea
                                                        id="update-text"
                                                        value={comment}
                                                        onChange={updateCommentHandler}
                                                    />
                                                </div>
                                                {errors.comment && <p className="error-message">{errors.comment}</p>}

                                                <div className={`report-buttons-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <button
                                                        type="submit"
                                                        className={`report-button-create ${mode === "dark" ? "dark" : "light"}`}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`report-button-cancel ${mode === "dark" ? "dark" : "light"}`}
                                                        onClick={props.closeModal}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <div>
                                            <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Info about report</p>
                                            <div className={`report-info-block`}>
                                                <div className={`report-info-block-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Date:</p>
                                                    {props.report.date?.length >= 3 && (
                                                        <p>{props.report.date[0]}-{props.report.date[1]}-{props.report.date[2]}</p>
                                                    )}
                                                </div>

                                                <div className={`report-info-block-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p>Hours:</p>
                                                    <p>{props.report.countOfHours}</p>
                                                </div>

                                                <div className={`request-info-block-comment-block ${mode === "dark" ? "dark" : "light"}`}>
                                                    <p className={`request-info-block-comment-block-title ${mode === "dark" ? "dark" : "light"}`}>Comment:</p>
                                                    <div className={`request-title-block ${mode === "dark" ? "dark" : "light"}`}>
                                                        <p className={`request-info-block-comment-block-data`}>
                                                            {props.report.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {!props.param && (
                                                <div className="report-action-buttons">
                                                    <button
                                                        className="report-action-buttons-update"
                                                        onClick={() => setFormValue('Update')}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="report-action-buttons-delete"
                                                        onClick={deleteReportHandler}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className={`title-report-block ${mode === "dark" ? "dark" : "light"}`}>Add a report</p>
                                    <form onSubmit={submitHandler}>
                                        <div className={`report-date-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                value={reportDate}
                                                onChange={dateHandler}
                                            />
                                        </div>
                                        {errors.date && <p className="error-message">{errors.date}</p>}

                                        <div className={`report-hours-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label>Amount of hours</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="8"
                                                value={reportHours}
                                                onChange={hoursHandler}
                                            />
                                        </div>
                                        {errors.hours && <p className="error-message">{errors.hours}</p>}

                                        <div className={`report-text-block ${mode === "dark" ? "dark" : "light"}`}>
                                            <label>Comment</label>
                                            <textarea
                                                value={reportText}
                                                onChange={textHandler}
                                                placeholder="Describe your work"
                                            />
                                        </div>
                                        {errors.text && <p className="error-message">{errors.text}</p>}
                                        {isAiGenerating && (<span className="error-message">Loading...</span>)}

                                        <div className="action-buttons">
                                            <div className="voice-button-container">
                                                <AudioRecorder
                                                    onRecordingComplete={handleVoiceRecording}
                                                    disabled={isAiGenerating}
                                                />
                                                {isAudioProcessing && <span className="processing-label">Processing...</span>}
                                            </div>

                                            <button
                                                type="button"
                                                className={`ai-button ${isAiGenerating ? 'disabled' : ''}`}
                                                onClick={generateReport}
                                                disabled={isAiGenerating}
                                            >
                                                Generate report with AI <LuBrainCircuit />
                                            </button>
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