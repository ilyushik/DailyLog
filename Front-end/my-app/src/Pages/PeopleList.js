import {Fragment, useCallback, useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import "./styles/PeopleList.css"
import axios from "axios";
import {PeopleListComponent} from "./PeopleListComponents/PeopleListComponent";
import PopupAllUsersExcel from "../Components/PopupAllUsersExcel";
import { GiPodiumWinner } from "react-icons/gi";
import { BiSolidReport } from "react-icons/bi";
import {PopupMonthWinner} from "../Components/PopupMonthWinner";

export function PeopleList() {
    const mode = useSelector(state => state.theme.theme);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [popupAllUsers, setPopupAllUsers] = useState(false);
    const [user, setUser] = useState({});
    const [showWinner, setShowWinner] = useState(false);


    const fetchUsersHandler = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/peopleList`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            console.log(response.data);
            setUsers(response.data);
        } catch(error) {
            console.error(error.response.data);
            setErrors(error.response.data);
        }
    }, [])

    const fetchUserHandler = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/getMyInfo`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            setUser(response.data);
            console.log(user);
        } catch (e) {
            console.error(e.response.data);
        }
    }, [])

    useEffect(() => {
        fetchUsersHandler();
        fetchUserHandler()
    }, [fetchUsersHandler, fetchUserHandler])

    const getReports = () => {
        if (user?.position === "Project Manager") {
            return (
                <div>
                    <button onClick={() => setPopupAllUsers(true)}>
                        <BiSolidReport className="svg"/>
                    </button>
                </div>
            )
        }
    }

    const EmployeeOfTheMonth = () => {
        if (user?.position === "Project Manager") {
            return (
                <div>
                    <button onClick={() => setShowWinner(true)}>
                        <GiPodiumWinner className="svg"/>
                    </button>
                </div>
            )
        }
    }

    return (
        <Fragment>
            {showWinner && (<PopupMonthWinner close = {() => setShowWinner(false)} />)}
            {popupAllUsers && (<PopupAllUsersExcel close={() => setPopupAllUsers(false)} />)}
            <div className={`people ${mode === "light" ? "light" : "dark"}`}>
                <div className={`people-title ${mode === "light" ? "light" : "dark"}`}>
                    <p>Team</p>

                    <div className="pm-buttons">
                        {EmployeeOfTheMonth()}
                        {getReports()}
                    </div>
                </div>
                <div className={`peoples-block ${mode === "light" ? "light" : "dark"}`}>
                    {users.length < 1 &&
                        <p className={`no-messages ${mode === "light" ? "light" : "dark"}`}>{errors.message}</p>}
                    {users.map((user) => (
                        <PeopleListComponent user={user} key={user.id}/>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}