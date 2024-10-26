import {Fragment, useState, useCallback, useEffect} from "react";
import { useSelector } from "react-redux";
import "./styles/Inbox.css"
import {request} from "../axios_helper"


export function Inbox() {
    const mode = useSelector((state) => state.mode);
    const [requests, setRequests] = useState([])
    const [errors, setErrors] = useState({})
    const id = 2

    const fetchRequestsHandler = useCallback(async () => {
        // try {
        //     const response = await axios.get(`http://localhost:8080/requests/approver/${id}`)
        //
        //     if (response.status !== 200) {
        //         throw new Error("Parasha...");
        //     }
        //
        //     const data = await response.data;
        //     setRequests(data)
        //     console.log(data)
        // } catch (error) {
        //     console.error(error)
        //     setErrors(error.response.data)
        // }

        request("GET", `requests/approver/${id}`, {})
            .then((res) => {
                setRequests(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err.response.data);
                setErrors(err.response.data)
            })
    }, [])


    useEffect(() => {
        fetchRequestsHandler()
    }, [fetchRequestsHandler])

    const approveRequest = (event, requestId) => {
        event.preventDefault();
        console.log(`Approve request: ${requestId}`)

        // try {
        //     const response = await axios.post(`http://localhost:8080/requests/approve/${requestId}`, requestId)
        //     if (response.status !== 200) {
        //         throw new Error("Parasha...");
        //     }
        //     const data = await response.data;
        //     console.log(data)
        //
        //     setRequests([])
        //     await fetchRequestsHandler()
        // } catch (error) {
        //     console.error(error.response.data)
        // }

        request("POST", `requests/approve/${requestId}`, {requestId})
            .then((res) => {
                setRequests([])
                console.log(res.data)
                fetchRequestsHandler()
            })
            .catch((err) => {
                console.log(err.response.data);

            })
    }

    const declineRequest = async (event, requestId) => {
        console.log(`Decline request: ${requestId}`)
        // try {
        //     const response = await axios.post(`http://localhost:8080/requests/decline/${requestId}`, requestId)
        //     if (response.status !== 200) {
        //         throw new Error("Parasha...");
        //     }
        //     const data = await response.data;
        //     console.log(data)
        //
        //     setRequests([])
        //     await fetchRequestsHandler()
        // } catch (error) {
        //     console.error(error.response.data)
        // }

        request("POST", `requests/decline/${requestId}`, {requestId})
            .then((res) => {
                setRequests([])
                console.log(res.data)
                fetchRequestsHandler()
            })
            .catch((err) => {
                console.log(err.response.data);
            })
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