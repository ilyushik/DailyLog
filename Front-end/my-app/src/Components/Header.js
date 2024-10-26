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
import {request} from "../axios_helper";


export function Header() {
    const mode = useSelector(state => state.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [popupSuccessIsOpen, setPopupSuccessIsOpen] = useState(false);
    const id = 1
    const [user, setUser] = useState({});

    const fetchUserHandler = useCallback(async () => {
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
        if (user.role === "ROLE_LEAD" || user.role === "ROLE_CEO") {
            return(<NavLink to="/inbox" className={`nav-inbox ${mode === "Light" ? "light" : "dark"}`}>
                <img className="button-inbox" src={inbox_icon} alt={""}/>
            </NavLink>)
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
    }

    return (
        <Fragment>
            {popupIsOpen && <Popup openSuccess={openPopupSuccess} close={closePopup}/>}
            {popupSuccessIsOpen && <PopupSuccess close={closePopupSuccess}/>}
            <header className={`header ${mode === "Dark" ? "dark" : "light"}`}>
                <button className="button-logo" onClick={() => {navigate("/", {replace: true})}}>
                    <img className="logo" src={logo} alt="logo"/>
                </button>

                <div className="nav">
                    {modeChanger()}

                    {inbox()}

                    {user &&
                        <button className={`button-request ${mode === "Dark" ? "dark" : "light"}`} onClick={openPopup}>+
                            Add a request</button>}
                </div>
            </header>
        </Fragment>
    )
}