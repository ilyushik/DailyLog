import {Fragment, useCallback, useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import "./styles/PeopleList.css"
import axios from "axios";
import {PeopleListComponent} from "./PeopleListComponents/PeopleListComponent";
import PopupAllUsersExcel from "../Components/PopupAllUsersExcel";

export function PeopleList() {
    const mode = useSelector(state => state.theme.theme);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [popupAllUsers, setPopupAllUsers] = useState(false);


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

    useEffect(() => {
        fetchUsersHandler();
    }, [fetchUsersHandler])

    return (
        <Fragment>
            {popupAllUsers && (<PopupAllUsersExcel close={() => setPopupAllUsers(false)} />)}
            <div className={`people ${mode === "light" ? "light" : "dark"}`}>
                <div className={`people-title ${mode === "light" ? "light" : "dark"}`}>
                    <p>Team</p>
                    <div>
                        <button onClick={() => setPopupAllUsers(true)}>All reports</button>
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