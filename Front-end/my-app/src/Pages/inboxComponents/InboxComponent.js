import "./InboxComponent.css"
import {useSelector} from "react-redux";
import approve from "../../images/approve.svg"
import decline from "../../images/decline.svg"

export function InboxComponent(props) {
    const mode = useSelector(state => state.mode);
    const request = props.request

    const calculateDifference = (startDate, endDate) => {
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const timeDifference = Math.abs(secondDate - firstDate);
        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return "1 day";
        }

        if (days === 1) {
            return "2 days";
        }

        return `${days + 1} days`;
    };


    return (
        <div className={`inbox-request-block ${mode === "Light" ? "light" : "dark"}`} key={props.request.id}>
            <div className={`inbox-request-maininfo-block ${mode === "Light" ? "light" : "dark"}`}>
                <p className={`message ${mode === "Light" ? "light" : "dark"}`}>You have received a request for {request.reason} from <span className={`username`}>{request.fullUserName}</span></p>
                <div className={`inbox-request-time-block`}>
                    <div className={`inbox-request-startdate-block ${mode === "Light" ? "light" : "dark"}`}>
                        <p className={`inbox-request-startdate-text-block ${mode === "Light" ? "light" : "dark"}`}>Start: </p>
                        <p className={`inbox-request-startdate-value-block ${mode === "Light" ? "light" : "dark"}`}>{request.startDate[0]}-{request.startDate[1]}-{request.startDate[2]}</p>
                    </div>

                    <div className={`inbox-request-enddate-block ${mode === "Light" ? "light" : "dark"}`}>
                        <p className={`inbox-request-enddate-text-block ${mode === "Light" ? "light" : "dark"}`}>End: </p>
                        <p className={`inbox-request-enddate-value-block ${mode === "Light" ? "light" : "dark"}`}>{request.finishDate[0]}-{request.finishDate[1]}-{request.finishDate[2]}</p>
                    </div>

                    <div className={`inbox-request-duration-block ${mode === "Light" ? "light" : "dark"}`}>
                        <p className={`inbox-request-duration-text-block ${mode === "Light" ? "light" : "dark"}`}>Duration:</p>
                        <p className={`inbox-request-duration-value-block ${mode === "Light" ? "light" : "dark"}`}>{calculateDifference(request.startDate, request.finishDate)}</p>
                    </div>
                </div>
            </div>

            <div className={`inbox-request-buttons-block ${mode === "Light" ? "light" : "dark"}`}>
                <button onClick={props.approve}><img className={`button-img`} src={approve} alt=""/></button>
                <button onClick={props.decline}><img className={`button-img`} src={decline} alt=""/></button>
            </div>
        </div>
    )
}