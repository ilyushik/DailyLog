import {Fragment} from "react";
import { useSelector } from "react-redux";
import "./styles/Inbox.css"
import approveImage from "../images/approved_message.svg"

const messages = [
    {
        id: 1,
        message: "You have received leave approval from the",
        from: "teamlead@gmail.com",
        status: "approved",
        date: "october 16"
    },
    {
        id: 2,
        message: "You have received leave approval from the",
        from: "techlead@gmail.com",
        status: "declined",
        date: "october 14"
    },
    {
        id: 3,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 4,
        message: "You have received leave approval from the",
        from: "ceo@gmail.com",
        status: "approved",
        date: "october 5"
    },
    {
        id: 5,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 6,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 7,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 9,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 10,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
    {
        id: 11,
        message: "You have received leave approval from the",
        from: "pm@gmail.com",
        status: "declined",
        date: "october 10"
    },
]

export function Inbox() {
    const mode = useSelector((state) => state.mode);

    const messageStatusImage = (messageStatus) => {
        if (messageStatus === "approved") {
            return(
                <img className={`approve-message-image ${mode === "Light" ? "light" : "dark"}`} src={approveImage}
                     alt={""}/>
            )
        } else if (messageStatus === "declined") {
            return (
                <img className={`approve-message-image ${mode === "Light" ? "light" : "dark"}`} src={approveImage}
                     alt={""}/>
            )
        }
    }

    return (
        <Fragment>
            <div className={`inbox-main-screen ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`inbox ${mode === "Light" ? "light" : "dark"}`}>
                    <div className={`inbox-title ${mode === "Light" ? "light" : "dark"}`}>Inbox</div>
                    <div className={`messages-block ${mode === "Light" ? "light" : "dark"}`}>
                        {messages.length < 1 && <p className={`no-messages ${mode === "Light" ? "light" : "dark"}`}>No messages...</p>}
                        {messages.map((message) => (
                            <div className={`message-container ${mode === "Light" ? "light" : "dark"}`} key={message.id}>
                                <div className={`icon-message-date-block ${mode === "Light" ? "light" : "dark"}`}>
                                    <div className={`icon-message-block ${mode === "Light" ? "light" : "dark"}`}>
                                        {messageStatusImage(message.status)}
                                        <p className={`message ${mode === "Light" ? "light" : "dark"}`}>{message.message} <i className={`email-from ${mode === "Light" ? "light" : "dark"}`}>{message.from}</i></p>
                                    </div>
                                    <div className={`message-date ${mode === "Light" ? "light" : "dark"}`}>{message.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}