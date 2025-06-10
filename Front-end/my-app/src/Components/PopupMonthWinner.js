import {Fragment, useEffect, useState} from "react";
import "./PopupSuccess.css"
import {useSelector} from "react-redux";
import "./PopupMonthWinner.css"
import axios from "axios";

export function PopupMonthWinner(props) {
    const mode = useSelector(state => state.theme.theme);

    const [aiResult, setAiResult] = useState({});
    const [user, setUser] = useState({});


    const getWinner = async () => {
        try {
            const response = await
                axios.get(`${process.env.REACT_APP_BACKEND_LINK}/deepseek/getLastWinner`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
            console.log(response.data)
            setAiResult(response.data);
            getUserByName(response.data.winnerFullname);
        } catch (e) {
            console.log(e.response.data)
        }
    }

    const getUserByName = async (winnerFullname) => {
        try {
            const response = await
                axios.get(`${process.env.REACT_APP_BACKEND_LINK}/users/username?username=${winnerFullname}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
            console.log(response.data)
            setUser(response.data);
        } catch (e) {
            console.log(e.response.data)
        }
    }

    useEffect(() => {
        getWinner();
    }, [])

    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber - 1] || "Unknown";
    };


    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}></div>

                <div className={`modal-justify ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "dark" ? "dark" : "light"}`}
                                onClick={props.close}>&times;</button>
                        {aiResult.winnerFullname ? (
                            <div className="winner">
                                <div className="winner-date">
                                    {aiResult.month && aiResult.year && (
                                        <span>{getMonthName(aiResult.month)} {aiResult.year}</span>
                                    )}
                                </div>
                                <img src={user.image} alt={user.firstName} className="winner-avatar" />
                                <h2 className="winner-name">{aiResult.winnerFullname}</h2>
                                <p className="winner-position">{user.position}</p>
                                <div className="winner-section">
                                    <h3>🏆 Summary</h3>
                                    <p>{aiResult.summary}</p>
                                </div>
                                <div className="winner-section">
                                    <h3>💡 Reason</h3>
                                    <p>{aiResult.reason}</p>
                                </div>
                            </div>
                        ) : (<div className="winner">
                            <span>No info</span>
                        </div>)}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}