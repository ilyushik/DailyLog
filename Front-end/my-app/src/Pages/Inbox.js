import {Fragment, useState, useCallback, useEffect} from "react";
import { useSelector } from "react-redux";
import "./styles/Inbox.css"
import approveImage from "../images/approved_message.svg"
import axios from "axios";

const messages = [
    {
        id: 1,
        message: "You have received leave approval from the",
        from: "teamlead@gmail.com",
        status: "approved",
        date: "october 16"
    },
    {
        id: 2,
        message: "You have received leave approval from the",
        from: "techlead@gmail.com",
        status: "declined",
        date: "october 14"
    },
    {
        id: 3,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 4,
        message: "You have received leave approval from the",
        from: "ceo@gmail.com",
        status: "approved",
        date: "october 5"
    },
    {
        id: 5,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 6,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 7,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 9,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 10,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 11,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
]

export function Inbox() {
    const mode = useSelector((state) => state.mode);
    const [requests, setRequests] = useState([])
    const [errors, setErrors] = useState({})
    const id = 2

    const fetchRequestsHandler = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/requests/approver/${id}`)

            if (response.status !== 200) {
                throw new Error("Parasha...");
            }

            const data = await response.data;
            setRequests(data)
            console.log(data)
        } catch (error) {
            console.error(error)
            setErrors(error.response.data)
        }
    }, [])


    useEffect(() => {
        fetchRequestsHandler()
    }, [fetchRequestsHandler])

    const approveRequest = async (event, requestId) => {
        event.preventDefault();
        console.log(`Approve request: ${requestId}`)

        try {
            const response = await axios.post(`http://localhost:8080/requests/approve/${requestId}`, requestId)
            if (response.status !== 200) {
                throw new Error("Parasha...");
            }
            const data = await response.data;
            console.log(data)

            setRequests([])
            await fetchRequestsHandler()
        } catch (error) {
            console.error(error.response.data)
        }
    }

    const declineRequest = async (event, requestId) => {
        console.log(`Decline request: ${requestId}`)
        try {
            const response = await axios.post(`http://localhost:8080/requests/decline/${requestId}`, requestId)
            if (response.status !== 200) {
                throw new Error("Parasha...");
            }
            const data = await response.data;
            console.log(data)

            setRequests([])
            await fetchRequestsHandler()
        } catch (error) {
            console.error(error.response.data)
        }
    }

    return (
        <Fragment>
            <div className={`inbox-main-screen ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`inbox ${mode === "Light" ? "light" : "dark"}`}>
                    <div className={`inbox-title ${mode === "Light" ? "light" : "dark"}`}>Inbox</div>
                    <div className={`messages-block ${mode === "Light" ? "light" : "dark"}`}>
                        {requests.length < 1 && <p className={`no-messages ${mode === "Light" ? "light" : "dark"}`}>{errors.message}</p>}
                        {requests.map((request) => (
                            <div className={`message-container ${mode === "Light" ? "light" : "dark"}`} key={request.id}>
                                <div className={`icon-message-date-block ${mode === "Light" ? "light" : "dark"}`}>
                                    <div className={`icon-message-block ${mode === "Light" ? "light" : "dark"}`}>
                                        <p className={`message ${mode === "Light" ? "light" : "dark"}`}>
                                            <i className={`email-from ${mode === "Light" ? "light" : "dark"}`}>{request.fullUserName}</i> wants {request.reason} from {request.startDate} until {request.finishDate}
                                        </p>
                                    </div>
                                    <div className="action_buttons">
                                        <button className="approve-button" onClick={(event) => {approveRequest(event, request.id)}}>Approve</button>
                                        <button className="decline-button" onClick={(event) => {declineRequest(event, request.id)}}>Decline</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}