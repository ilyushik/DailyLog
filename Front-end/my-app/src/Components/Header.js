import {useDispatch, useSelector} from "react-redux";
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
import { toggleTheme } from '../store/index';
import burger from '../images/burger-menu.svg'
import {PopupLoading} from "./PopupLoading";


export function Header() {
    const mode = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [popupSuccessIsOpen, setPopupSuccessIsOpen] = useState(false);
    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);
    const [logoutPopupIsOpen, setLogoutPopupIsOpen] = useState(false);
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isLoadingPopup, setIsLoadingPopup] = useState(false);

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
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/getMyInfo`,
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

    const modeChanger = () => {
        if (isAuthenticated()) {
            if (mode === "Light") {
                return (<button className={`navbar-button-b ${mode === "light" ? "light" : "dark"}`} onClick={() => {
                    setIsMenuOpened(false)
                    dispatch(toggleTheme())
                }}>
                    <div className={`change-theme-wrapper`}>
                        <img className={`mode-button`} src={dark_theme} alt=""/>
                        <p className={`navbar-text ${mode === "light" ? "light" : "dark"}`}>Change theme</p>
                    </div>
                </button>)
            } else {
                return (
                    <button className={`navbar-button-b ${mode === "light" ? "light" : "dark"}`} onClick={() => {
                        setIsMenuOpened(false)
                        dispatch(toggleTheme())
                    }}>
                        <div className={`change-theme-wrapper`}>
                            <img className={`mode-button`} src={light_theme} alt=""/>
                            <p className={`navbar-text ${mode === "light" ? "light" : "dark"}`}>Change theme</p>
                        </div>
                    </button>)
            }
        }
    }

    const inbox = () => {
        if (isAuthenticated()) {
            if (user.role === "ROLE_LEAD" || user.role === "ROLE_CEO") {
                return(<NavLink to="/inbox" onClick={() => setIsMenuOpened(false)} className={`navbar-button ${mode === "light" ? "light" : "dark"}`}>
                    <div className="button-inbox-wrapper">
                        <img className="button-inbox" src={inbox_icon} alt=""/>
                        {requests.length !== 0 && <div className="notification-dot"></div>}
                    </div>
                    <p className={`navbar-text ${mode === "light" ? "light" : "dark"}`}>Inbox</p>

                </NavLink>)
            }
        }
    }

    const peopleIcon = () => {
        if (isAuthenticated()) {
            if ((user.role === "ROLE_LEAD" && user.position !== "Project Manager") || user.role === "ROLE_CEO") {
                return (<NavLink to="/people" onClick={() => setIsMenuOpened(false)} className={`navbar-button ${mode === "light" ? "light" : "dark"}`}>
                    <div className="button-people-wrapper">
                        <img className="button-people" src={peopleList} alt=""/>
                    </div>
                    <p className={`navbar-text ${mode === "light" ? "light" : "dark"}`}>Team</p>

                </NavLink>)
            }
        }
    }

    const toggleMenu = (e) => {
        e.preventDefault();
        setIsMenuOpened(!isMenuOpened);
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

    const closeLoading = () => {
        setIsLoadingPopup(false)
    }

    const openLoading = () => {
        setIsLoadingPopup(true)
    }

    return (
        <Fragment>
            {isLoadingPopup && <PopupLoading />}
            {logoutPopupIsOpen && <PopupLogout close={closeLogoutPopup}/>}
            {popupIsOpen && <Popup openSuccess={openPopupSuccess} close={closePopup} closeLoad={closeLoading} openLoad={openLoading}/>}
            {popupSuccessIsOpen && <PopupSuccess close={closePopupSuccess} title="The request was
                                    successfully sent!" message="Wait for a message
                                    confirming your request"/>}
            <div className={`blur-layer ${isMenuOpened ? "open" : ""}`} onClick={toggleMenu}>

            </div>
            <header className={`header ${mode === "dark" ? "dark" : "light"}`}>
                <button className="button-logo" onClick={() => {
                    navigate("/my-info")
                    window.location.reload()
                }}>
                    <img className="logo" src={logo} alt="logo"/>
                </button>

                <div className="nav">
                    <div
                        className={`navbar-hidden-buttons ${isMenuOpened ? "open" : ""} ${mode === "light" ? "light" : "dark"}`}>
                        {modeChanger()}

                        {inbox()}

                        {peopleIcon()}

                        {isAuthenticated() &&
                            <button onClick={() => {
                                setIsMenuOpened(false)
                                openLogoutPopup()
                            }} className={`logout_button`}>
                                <div className={`logout-wrapper`}>
                                    <img className={`logout_img`} src={logout_img} alt="Log out"/>
                                    <p className={`navbar-text ${mode === "light" ? "light" : "dark"}`}>Logout</p>
                                </div>
                            </button>}
                    </div>

                    {isAuthenticated() &&
                        <button className={`button-request ${mode === "dark" ? "dark" : "light"}`}
                                onClick={openPopup}>+
                            Add a request</button>}

                    {isAuthenticated() &&
                        <button className={`burger-button`} onClick={toggleMenu}><img className={`burger-img`}
                                                                                      src={burger} alt=""/></button>}
                </div>
            </header>
        </Fragment>
    )
}