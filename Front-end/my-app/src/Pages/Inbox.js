import {Fragment, useState, useCallback, useEffect} from "react";
import { useSelector } from "react-redux";
import "./styles/Inbox.css"
import {request} from "../axios_helper"
import {InboxComponent} from "./inboxComponents/InboxComponent";
import axios from "axios";


export function Inbox() {
    const mode = useSelector((state) => state.mode);
    const [requests, setRequests] = useState([])
    const [errors, setErrors] = useState({})

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

        // request("GET", `requests/approver`, {})
        //     .then((res) => {
        //         setRequests(res.data)
        //         console.log(res.data)
        //     })
        //     .catch((err) => {
        //         console.log(err.response.data);
        //         setErrors(err.response.data)
        //     })
    }, [])


    useEffect(() => {
        fetchRequestsHandler()
    }, [fetchRequestsHandler])

    const approveRequest = async (event, requestId) => {
        event.preventDefault();
        console.log(`Approve request: ${requestId}`)

        try {
            const response = await axios.post(`http://localhost:8080/requests/approve/${requestId}`, {requestId: requestId},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            console.log(response.data);
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
            setRequests([]);
            fetchRequestsHandler()
        } catch(error) {
            console.log(error.response.data);
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