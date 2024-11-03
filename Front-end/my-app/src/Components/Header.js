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


export function Header() {
    const mode = useSelector(state => state.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [popupSuccessIsOpen, setPopupSuccessIsOpen] = useState(false);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);

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

    return (
        <Fragment>
            {popupIsOpen && <Popup openSuccess={openPopupSuccess} close={closePopup}/>}
            {popupSuccessIsOpen && <PopupSuccess close={closePopupSuccess}/>}
            <header className={`header ${mode === "Dark" ? "dark" : "light"}`}>
                <button className="button-logo" onClick={() => {navigate("/")}}>
                    <img className="logo" src={logo} alt="logo"/>
                </button>

                <div className="nav">
                    {modeChanger()}

                    {inbox()}

                    {isAuthenticated() &&
                        <button className={`button-request ${mode === "Dark" ? "dark" : "light"}`} onClick={openPopup}>+
                            Add a request</button>}
                </div>
            </header>
        </Fragment>
    )
}