import "./RequestComponent.css"
import {useSelector} from "react-redux";

export function RequestComponent(props) {
    const mode = useSelector(state => state.theme.theme);
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
            return "2 days";
        }

        return `${days + 1} days`;
    };

    const statusHandler = (status) => {
        if (status === "Pending") {
            return (<p className={`inner-request-status-pending-block ${mode === "light" ? "light" : "dark"}`}>{request.status}</p>)
        }
        if (status === "Approved") {
            return (<p className={`inner-request-status-approved-block ${mode === "light" ? "light" : "dark"}`}>{request.status}</p>)
        }
        if (status === "Declined") {
            return (<p className={`inner-request-status-declined-block ${mode === "light" ? "light" : "dark"}`}>{request.status}</p>)
        }
    }

    return (
        <div className={`request-block ${mode === "light" ? "light" : "dark"}`} key={request.id}>
            <div className={`request-reason-block ${mode === "light" ? "light" : "dark"}`}>
                <p className={`request-reason-value-block ${mode === "light" ? "light" : "dark"}`}>{request.reason}</p>
            </div>

            <div className={`request-start-end-duration-block ${mode === "light" ? "light" : "dark"}`}>
                <div className={`inner-request-start-block ${mode === "light" ? "light" : "dark"}`}>
                    <p className={`inner-request-start-text-block ${mode === "light" ? "light" : "dark"}`}>Start:</p>
                    <p className={`inner-request-start-value-block ${mode === "light" ? "light" : "dark"}`}>{request.startDate[0]}-{request.startDate[1]}-{request.startDate[2]}</p>
                </div>

                <div className={`inner-request-end-block ${mode === "light" ? "light" : "dark"}`}>
                    <p className={`inner-request-end-text-block ${mode === "light" ? "light" : "dark"}`}>End:</p>
                    <p className={`inner-request-end-value-block ${mode === "light" ? "light" : "dark"}`}>{request.finishDate[0]}-{request.finishDate[1]}-{request.finishDate[2]}</p>
                </div>

                <div className={`inner-request-duration-block ${mode === "light" ? "light" : "dark"}`}>
                    <p className={`inner-request-duration-text-block ${mode === "light" ? "light" : "dark"}`}>Duration:</p>
                    <p className={`inner-request-duration-value-block ${mode === "light" ? "light" : "dark"}`}>{calculateDifference(request.startDate, request.finishDate)}</p>
                </div>
            </div>

            <div className={`request-status-block`}>
                <p className={`inner-request-status-text-block ${mode === "light" ? "light" : "dark"}`}>Status:</p>
                {statusHandler(request.status)}
            </div>

            <div className="request-buttons-block">
                <div className="request-edit-button-block">
                    <button className="request-edit-button">Edit</button>
                </div>

                <div className="request-delete-button-block">
                    <button className="request-delete-button" onClick={props.deleteRequest}>Delete</button>
                </div>
            </div>
        </div>
    )
}