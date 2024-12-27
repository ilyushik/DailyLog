import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import "./PeopleListComponent.css"
import job_icon_light from "../../images/position-icon.svg"
import job_icon_dark from "../../images/position-icon-dark.svg"
import {Fragment, useEffect, useState} from "react";
import axios from "axios";
import PopupUserExcel from "../../Components/PopupUserExcel";

export function PeopleListComponent(props) {
    const mode = useSelector(state => state.theme.theme);
    const [user, setUser] = useState({});
    const [popupOneUser, setPopupOneUser] = useState(false);

    const positionIconMode = () => {
        if (mode === "Light") {
            return(<img className="position-icon" src={job_icon_light} alt="position-icon" />)
        } else {
            return(<img className="position-icon" src={job_icon_dark} alt="position-icon" />)
        }
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/getMyInfo`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            setUser(response.data);
        } catch (e) {
            console.log(e.response.data);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const detailsButton = () => {
        if (user !== null) {
            if (user.position === 'Project Manager') {
                return (
                    <button onClick={() => setPopupOneUser(true)}>
                        <p>Reports</p>
                    </button>
                )
            } else {
                return (
                    <Link to={`/user/${props.user.id}`}>
                        <p>Learn more</p>
                    </Link>
                )
            }
        }
    }

    const closePopup = () => {
        setPopupOneUser(false);
    }

    return (
        <Fragment>
            {popupOneUser && (<PopupUserExcel userId={props.user.id} close={closePopup} />)}
            <div className={`person-block ${mode === "light" ? "light" : "dark"}`} key={props.key}>
                <div className={`person-info-block`}>
                    <div className={`person-image`}>
                        <img className={`person-img`} src={props.user.image} alt=""/>
                    </div>

                    <div className={`person-info`}>
                        <div className={`person-data ${mode === "light" ? "light" : "dark"}`}>
                            <p className={`person-name ${mode === "light" ? "light" : "dark"}`}>{props.user.firstName}</p>
                            <p className={`person-surname ${mode === "light" ? "light" : "dark"}`}>{props.user.secondName}</p>
                        </div>

                        <div className={`person-job`}>
                            {positionIconMode()}
                            <p className={`person-position ${mode === "light" ? "light" : "dark"}`}>{props.user.position}</p>
                        </div>
                    </div>
                </div>

                <div className={`link-info-block ${mode === "light" ? "light" : "dark"}`}>
                    {detailsButton()}
                </div>
            </div>
        </Fragment>
    )
}