import {Fragment, useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import "./styles/MainScreen.css";
import positionIconLight from "../images/position-icon.svg";
import positionIconDark from "../images/position-icon-dark.svg";
import {RequestComponent} from "./mainScreenComponents/RequestComponent";
import axios from "axios";
import {CalendarComponent} from "./mainScreenComponents/CalendarComponent";
import {useParams} from "react-router";

export function MainScreen() {
    const params = useParams();
    const mode = useSelector(state => state.theme.theme);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState({});
    const token = localStorage.getItem("token");

    const themeClass = mode === "Light" ? "light" : "dark"; // Store the theme class

    // Utility function for fetching data with error handling
    const fetchData = async (url, setData) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
        } catch (error) {
            setError(error.response.data);
            setData([]);
        }
    };

    const fetchUserHandler = useCallback(() => {
        const url = params.id
            ? `http://localhost:8080/users/${params.id}`
            : "http://localhost:8080/getMyInfo";
        fetchData(url, setUser);
    }, [params.id]);

    const fetchRequestHandler = useCallback(() => {
        const url = params.id
            ? `http://localhost:8080/requests/userRequests/${params.id}`
            : "http://localhost:8080/requests";
        fetchData(url, setRequests);
    }, [params.id]);

    useEffect(() => {
        fetchUserHandler();
    }, [fetchUserHandler]);

    useEffect(() => {
        fetchRequestHandler();
    }, [fetchRequestHandler]);

    const positionIcon = () => (
        <img className="position-icon" src={mode === "dark" ? positionIconDark : positionIconLight} alt="position-icon" />
    );

    return (
        <Fragment>
            <div className={`mainScreen-main-block ${mode === "light" ? "light" : "dark"}`}>
                <div className={`image-text-block ${mode === "light" ? "light" : "dark"}`}>
                    <img className={`image-logo ${mode === "light" ? "light" : "dark"}`} src={user.image} alt="User profile" />
                    <div className="position-icon-position-title-container">
                        <div className="empty-div"></div>
                        <div className="right-image-info-block">
                            <div className="name-block">
                                <p className={`name ${mode === "light" ? "light" : "dark"}`}>{user.firstName} {user.secondName}</p>
                            </div>
                            <div className="position-icon-position-title-block">
                                {positionIcon()}
                                <p className={`position ${mode === "light" ? "light" : "dark"}`}>{user.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="requests-calendar-block">
                    <div className={`active-requests ${mode === "light" ? "light" : "dark"}`}>
                        <div className="active-requests-title">Active requests</div>
                        <div className="requests-block">
                            {error.message && (
                                <p className={`no-active-requests ${mode === "light" ? "light" : "dark"}`}>{error.message}</p>
                            )}
                            {requests.map((request) => (
                                <RequestComponent key={request.id} request={request}/>
                            ))}
                        </div>
                    </div>

                    <div className="calendar-block">
                        <CalendarComponent />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
