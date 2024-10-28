import {Fragment, useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import "./styles/MainScreen.css"
import positionIconLight from "../images/position-icon.svg"
import positionIconDark from "../images/position-icon-dark.svg"
import {RequestComponent} from "./mainScreenComponents/RequestComponent";
import axios from "axios";

export function MainScreen() {
    const mode = useSelector(state => state.mode);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState({});
    const token = localStorage.getItem("token");

    const fetchUserHandler = useCallback(async () => {
        try {
            console.log(token);
            const response = await axios.get("http://localhost:8080/getMyInfo",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            setError(error.response.data);
        }
    }, [])

    useEffect(() => {
        fetchUserHandler();
    }, [fetchUserHandler]);

    const fetchRequestHandler = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/requests",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
            setError({})
            console.log(response.data);
            setRequests(response.data);
        } catch (error) {
            setError(error.response.data);
            setRequests([])
        }
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
                                <RequestComponent key={request.id} request={request}/>
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