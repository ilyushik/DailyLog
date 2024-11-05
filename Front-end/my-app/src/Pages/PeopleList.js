import {Fragment, useCallback, useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import "./styles/PeopleList.css"
import axios from "axios";
import {PeopleListComponent} from "./PeopleListComponents/PeopleListComponent";

export function PeopleList() {
    const mode = useSelector((state) => state.mode);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    const fetchUsersHandler = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/peopleList", {
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
            <div className={`people-main-screen ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`people ${mode === "Light" ? "light" : "dark"}`}>
                    <div className={`people-title ${mode === "Light" ? "light" : "dark"}`}>Team</div>
                    <div className={`peoples-block ${mode === "Light" ? "light" : "dark"}`}>
                        {users.length < 1 &&
                            <p className={`no-messages ${mode === "Light" ? "light" : "dark"}`}>{errors.message}</p>}
                        {users.map((user) => (
                            <PeopleListComponent user={user} key={user.id} />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}