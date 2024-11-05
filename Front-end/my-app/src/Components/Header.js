import {useDispatch, useSelector} from "react-redux";
import {modeActions} from "../store/index";
import logo from "../images/logo.png";
import {NavLink, useNavigate} from "react-router-dom"
import "./Header.css"
import dark_theme from "../images/night_theme.svg"
import inbox_icon from "../images/inbox.svg"
import light_theme from "../images/light.svg"
import {Fragment, useCallback, useEffect, useState} from "react";
import {Popup} from "./Popup";
import {PopupSuccess} from "./PopupSuccess";
import axios from "axios";
import logout_img from "../images/logout.svg"
import peopleList from "../images/peopleList.svg"
import {PopupLogout} from "./PopupLogout";


export function Header() {
    const mode = useSelector(state => state.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [popupSuccessIsOpen, setPopupSuccessIsOpen] = useState(false);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const [logoutPopupIsOpen, setLogoutPopupIsOpen] = useState(false);

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
        }
    }, [])


    useEffect(() => {
        fetchRequestsHandler()
    }, [fetchRequestsHandler])

    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        return !!token;
    }

    const fetchUserHandler = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/getMyInfo",
                {headers: { Authorization: `Bearer ${token}` }});
            if (response.status !== 200) {
                throw new Error("Fail...");
            }

            console.log(response.data);
            setUser(response.data);
        } catch (error) {
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated()) {
            fetchUserHandler();
        }
    }, [fetchUserHandler]);

    const lightMode = () => {
        dispatch(modeActions.lightMode())
    }

    const darkMode = () => {
        dispatch(modeActions.darkMode())
    }

    const modeChanger = () => {
        if (mode === "Light") {
            return (<button className="button-theme" onClick={darkMode}><img src={dark_theme} alt={dark_theme}/></button>)
        } else {
            return (
                <button className="button-theme" onClick={lightMode}><img src={light_theme} alt={light_theme}/></button>)
        }
    }

    const inbox = () => {
        if (isAuthenticated()) {
            if (user.role === "ROLE_LEAD" || user.role === "ROLE_CEO") {
                return(<NavLink to="/inbox" className={`nav-inbox ${mode === "Light" ? "light" : "dark"}`}>
                    <div className="button-inbox-wrapper">
                        <img className="button-inbox" src={inbox_icon} alt=""/>
                        {requests.length !== 0 && <div className="notification-dot"></div>}
                    </div>

                </NavLink>)
            }
        }
    }

    const peopleIcon = () => {
        if (isAuthenticated()) {
            if ((user.role === "ROLE_LEAD" && user.position !== "Project Manager")  || user.role === "ROLE_CEO") {
                return (<NavLink to="/people" className={`nav-inbox ${mode === "Light" ? "light" : "dark"}`}>
                    <div className="button-people-wrapper">
                        <img className="button-people" src={peopleList} alt=""/>
                    </div>
                </NavLink>)
            }
        }
    }

    const openPopup = () => {
        setPopupIsOpen(true);
    }

    const closePopup = () => {
        setPopupIsOpen(false);
    }

    const openPopupSuccess = () => {
        setPopupSuccessIsOpen(true)
    }

    const closePopupSuccess = () => {
        setPopupSuccessIsOpen(false);
        window.location.reload()
    }

    const openLogoutPopup = () => {
        setLogoutPopupIsOpen(true);
    }

    const closeLogoutPopup = () => {
        setLogoutPopupIsOpen(false);
    }

    return (
        <Fragment>
            {logoutPopupIsOpen && <PopupLogout close={closeLogoutPopup}/>}
            {popupIsOpen && <Popup openSuccess={openPopupSuccess} close={closePopup}/>}
            {popupSuccessIsOpen && <PopupSuccess close={closePopupSuccess} title="The request was
                                    successfully sent!" message="Wait for a message
                                    confirming your request"/>}
            <header className={`header ${mode === "Dark" ? "dark" : "light"}`}>
                <button className="button-logo" onClick={() => {navigate("/")}}>
                    <img className="logo" src={logo} alt="logo"/>
                </button>

                <div className="nav">
                    {modeChanger()}

                    {inbox()}

                    {peopleIcon()}

                    {isAuthenticated() &&
                    <button onClick={openLogoutPopup} className={`logout_button`}><img src={logout_img} alt=""/></button>}

                    {isAuthenticated() &&
                        <button className={`button-request ${mode === "Dark" ? "dark" : "light"}`} onClick={openPopup}>+
                            Add a request</button>}
                </div>
            </header>
        </Fragment>
    )
}