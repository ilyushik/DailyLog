import {Fragment, useState, useCallback, useEffect} from "react";
import { useSelector } from "react-redux";
import "./styles/Inbox.css"
import {InboxComponent} from "./inboxComponents/InboxComponent";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import {Email} from "../emails/Email.tsx";

export function Inbox() {
    const mode = useSelector(state => state.theme.theme);
    const [requests, setRequests] = useState([])
    const [errors, setErrors] = useState({})

    const handleSendEmail = async (email, message, link, buttonText) => {
        const htmlContent = ReactDOMServer.renderToString(<Email message={message} link={link} buttonText={buttonText} />)

        try {
            const response = await axios.post("http://localhost:8080/api/send-email", {
                html: htmlContent,
                userEmail: email,
            })
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchRequestsHandler = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/requests/approver",{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            console.log(response.data);
            setRequests(response.data);
        } catch(error) {
            console.log(error.response.data);
            setErrors(error.response.data);
        }
    }, [])


    useEffect(() => {
        fetchRequestsHandler()
    }, [fetchRequestsHandler])

    const approveRequest = async (event, requestId) => {
        event.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/requests/approve/${requestId}`, {requestId: requestId},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data);

            if (response.data.requestStatus === "Approved") {
                handleSendEmail(response.data.userEmail, "Your request has been approved!",
                    "http://localhost:3000/my-info", "Back to requests")
            }
            setRequests([]);
            fetchRequestsHandler()
        } catch(error) {
            console.log(error.response.data);
        }
    }

    const declineRequest = async (event, requestId) => {
        event.preventDefault();
        console.log(`Decline request: ${requestId}`)

        try {
            const response = await axios.post(`http://localhost:8080/requests/decline/${requestId}`, {requestId: requestId},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data);

            if (response.data.requestStatus === "Declined") {
                handleSendEmail(response.data.userEmail, "Your request has been declined!",
                    "http://localhost:3000/my-info", "Back to requests")
            }

            setRequests([]);
            fetchRequestsHandler()
        } catch(error) {
            console.log(error.response.data);
        }

    }

    return (
        <Fragment>
            <div className={`inbox-main-screen ${mode === "light" ? "light" : "dark"}`}>
                <div className={`inbox ${mode === "light" ? "light" : "dark"}`}>
                    <div className={`inbox-title ${mode === "light" ? "light" : "dark"}`}>Inbox</div>
                    <div className={`messages-block ${mode === "light" ? "light" : "dark"}`}>
                        {requests.length < 1 && <p className={`no-messages ${mode === "light" ? "light" : "dark"}`}>{errors.message}</p>}
                        {requests.map((request) => (
                            <InboxComponent request={request} key={request.id}
                                            approve={(event) => approveRequest(event, request.id)}
                                            decline={(event) => declineRequest(event, request.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}