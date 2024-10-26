import {Fragment, useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import "./styles/MainScreen.css"
import positionIconLight from "../images/position-icon.svg"
import positionIconDark from "../images/position-icon-dark.svg"
import {request} from "../axios_helper"

export function MainScreen() {
    const mode = useSelector(state => state.mode);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const id = 5
    const [error, setError] = useState({});

    const fetchUserHandler = useCallback(async () => {
        // try {
        //     const response = await axios.get(`http://localhost:8080/users/${id}`);
        //
        //     if (response.status !== 200) {
        //         throw new Error("Wrong");
        //     }
        //
        //     const data = await response.data;
        //     setUser(data);
        //     console.log("user data", data);
        // } catch (error) {
        //     console.log(error)
        // }

        request("GET", `users/${id}`, {})
            .then((res) => {
                console.log("user data", res.data);
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }, [])

    useEffect(() => {
        fetchUserHandler();
    }, [fetchUserHandler]);

    const fetchRequestHandler = useCallback(async () => {
        // try {
        //     const response = await axios.get(`http://localhost:8080/requests/${id}`);
        //
        //     if (response.status === 400) {
        //         throw new Error("Wrong");
        //     }
        //
        //     const data = await response.data;
        //     setError({});
        //     setRequests(data);
        //     console.log("requests data", data);
        // } catch (error) {
        //     console.error(error.response.data)
        //     setError(error.response.data)
        //     setRequests([])
        // }

        request("GET", `requests/${id}`, {})
            .then((res) => {
                setError({})
                setRequests(res.data);
                console.log("requests data", res.data);
            })
            .catch((err) => {
                console.log(err)
                setError(err.response.data);
                setRequests([])
            })
    }, [])

    useEffect(() => {
        fetchRequestHandler();
    }, [fetchRequestHandler]);

    const positionIcon = () => {
        if (mode === "dark") {
            return (<img className="position-icon" src={positionIconDark} alt="position-iconDark" />)
        } else {
            return (<img className="position-icon" src={positionIconLight} alt="position-iconLight" />)
        }
    }

    const calculateDifference = (startDate, endDate) => {
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const timeDifference = Math.abs(secondDate - firstDate);
        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> 1 day</p>);
        }

        if (days === 1) {
            return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> 1 day</p>);
        }

        return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> {days} days</p>);
    };

    const requestStatusCircle = (status) => {
        if (status === "Pending") {
            return (<div className={`status-pending`}></div>)
        }
        if (status === "Approved") {
            return (<div className={`status-approve`}></div>)
        }
        if (status === "Declined") {
            return (<div className={`status-decline`}></div>)
        }
    }

    return (
        <Fragment>
            <div className={`mainScreen-main-block ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`image-text-block ${mode === "Light" ? "light" : "dark"}`}>
                    <img className={`image-logo ${mode === "Light" ? "light" : "dark"}`} src={user.image} alt=""/>
                    <div className="position-icon-position-title-container">
                        <div className="empty-div"></div>
                        <div className="right-image-info-block">
                            <div className="name-block">
                                <p className={`name ${mode === "Light" ? "light" : "dark"}`}>{user.firstName} {user.secondName}</p>
                            </div>
                            <div className="position-icon-position-title-block">
                                {positionIcon()}
                                <p className={`position ${mode === "Light" ? "light" : "dark"}`}>{user.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`requests-calendar-block`}>
                    <div className={`active-requests ${mode === "Light" ? "light" : "dark"}`}>
                        <div className={`active-requests-title`}>Active requests</div>
                        <div className={`requests-block`}>
                            {error.message &&
                                <p className={`no-active-requests ${mode === "Light" ? "light" : "dark"}`}>{error.message}</p>}
                            {requests.map((request) => (

                                <div key={request.id} className={`request-block-justify`}>
                                    <div className={`request-block ${mode === "Light" ? "light" : "dark"}`}>
                                        <div className={`request-reason ${mode === "Light" ? "light" : "dark"}`}>
                                            {requestStatusCircle(request.status)}
                                            <p className={`request-reason-text ${mode === "Light" ? "light" : "dark"}`}>{request.reason}</p>
                                        </div>
                                        <div
                                            className={`request-main-info-block ${mode === "Light" ? "light" : "dark"}`}>
                                            <div className={`start-date-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>Start: </p>
                                                <p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}>{request.startDate}</p>
                                            </div>
                                            <div className={`end-date-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>End: </p>
                                                <p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}>{request.finishDate}</p>
                                            </div>
                                            <div className={`duration-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>Duration: </p>
                                                {calculateDifference(request.startDate, request.finishDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`calendar-block`}>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}