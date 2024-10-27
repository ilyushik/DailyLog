import "./RequestComponent.css"
import {useSelector} from "react-redux";

export function RequestComponent(props) {
    const mode = useSelector(state => state.mode);
    const request = props.request;

    const calculateDifference = (startDate, endDate) => {
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const timeDifference = Math.abs(secondDate - firstDate);
        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return "1 day";
        }

        if (days === 1) {
            return "1 day";
        }

        return `${days} days`;
    };

    const statusHandler = (status) => {
        if (status === "Pending") {
            return (<p className={`inner-request-status-pending-block ${mode === "Light" ? "light" : "dark"}`}>{request.status}</p>)
        }
        if (status === "Approved") {
            return (<p className={`inner-request-status-approved-block ${mode === "Light" ? "light" : "dark"}`}>{request.status}</p>)
        }
        if (status === "Declined") {
            return (<p className={`inner-request-status-declined-block ${mode === "Light" ? "light" : "dark"}`}>{request.status}</p>)
        }
    }


    return (
        <div className={`request-block ${mode === "Light" ? "light" : "dark"}`} key={props.key}>
            <div className={`request-reason-block ${mode === "Light" ? "light" : "dark"}`}>
                <p className={`request-reason-value-block ${mode === "Light" ? "light" : "dark"}`}>{request.reason}</p>
            </div>

            <div className={`request-start-end-duration-block ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`inner-request-start-block ${mode === "Light" ? "light" : "dark"}`}>
                    <p className={`inner-request-start-text-block ${mode === "Light" ? "light" : "dark"}`}>Start:</p>
                    <p className={`inner-request-start-value-block ${mode === "Light" ? "light" : "dark"}`}>{request.startDate}</p>
                </div>

                <div className={`inner-request-end-block ${mode === "Light" ? "light" : "dark"}`}>
                    <p className={`inner-request-end-text-block ${mode === "Light" ? "light" : "dark"}`}>End:</p>
                    <p className={`inner-request-end-value-block ${mode === "Light" ? "light" : "dark"}`}>{request.finishDate}</p>
                </div>

                <div className={`inner-request-duration-block ${mode === "Light" ? "light" : "dark"}`}>
                    <p className={`inner-request-duration-text-block ${mode === "Light" ? "light" : "dark"}`}>Duration:</p>
                    <p className={`inner-request-duration-value-block ${mode === "Light" ? "light" : "dark"}`}>{calculateDifference(request.startDate, request.finishDate)}</p>
                </div>
            </div>

            <div className={`request-status-block`}>
                <p className={`inner-request-status-text-block ${mode === "Light" ? "light" : "dark"}`}>Status:</p>
                {statusHandler(request.status)}
            </div>
        </div>
    )
}