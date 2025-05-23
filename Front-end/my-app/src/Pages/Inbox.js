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

    const handleSendEmail = async (email, message, link, buttonText, emailTitle) => {
        const htmlContent = ReactDOMServer.renderToString(<Email message={message} link={link} buttonText={buttonText} />)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/api/send-email`, {
                html: htmlContent,
                userEmail: email,
                emailTitle: emailTitle,
            })
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchRequestsHandler = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/requests/approver`,{
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/requests/approve/${requestId}`, {requestId: requestId},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data);

            if (response.data.requestStatus === "Approved") {
                handleSendEmail(response.data.userEmail, "Your request has been approved!",
                    `${process.env.REACT_APP_FRONTEND_LINK}/my-info`, "Back to requests",
                    "Request's status")
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

        const decliner = localStorage.getItem('username');

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/requests/decline/${requestId}`, {requestId: requestId},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data);

            if (response.data.requestStatus === "Declined") {
                handleSendEmail(response.data.userEmail, `${decliner} declined your request!`,
                    `${process.env.REACT_APP_FRONTEND_LINK}/my-info`, "Back to requests",
                    "Request's status")
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