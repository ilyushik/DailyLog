import {Fragment} from "react";
import {useSelector} from "react-redux";
import "./styles/MainScreen.css"
import positionIconLight from "../images/position-icon.svg"
import positionIconDark from "../images/position-icon-dark.svg"

const user = {
    first_name : "Illia",
    second_name: "Kamarali",
    position: "Junior Java Developer",
    image: "https://1drv.ms/i/c/2ed1fe62a05badfb/IQQKRCBNXdr0SqTtR3G9HzCjAXT_Je4e14BPo0fGAeVmFQ8?width=1024"
}

const active_requests = [
    {
        id: 1,
        reason: "Vacation",
        start_date: "2018-04-01",
        end_date: "2018-04-08",
    },
    {
        id: 2,
        reason: "Sick Leave",
        start_date: "2018-05-01",
        end_date: "2018-05-01",
    },
]


export function MainScreen() {
    const mode = useSelector(state => state.mode);

    const positionIcon = () => {
        if (mode === "dark") {
            return (<img className="position-icon" src={positionIconDark} alt="position-iconDark" />)
        } else {
            return (<img className="position-icon" src={positionIconLight} alt="position-iconLight" />)
        }
    }

    const calculateDifference = (startDate, endDate) => {
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const timeDifference = Math.abs(secondDate - firstDate);
        const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> 1 days</p>);
        }

        if (days === 1) {
            return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> 1 days</p>);
        }

        return (<p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}> {days} days</p>);
    };

    return (
        <Fragment>
            <div className={`mainScreen-main-block ${mode === "Light" ? "light" : "dark"}`}>
                <div className={`image-text-block ${mode === "Light" ? "light" : "dark"}`}>
                    <img className={`image-logo ${mode === "Light" ? "light" : "dark"}`} src={user.image} alt=""/>
                    <div className="position-icon-position-title-container">
                        <div className="empty-div"></div>
                        <div className="right-image-info-block">
                            <div className="name-block">
                                <p className={`name ${mode === "Light" ? "light" : "dark"}`}>{user.first_name} {user.second_name}</p>
                            </div>
                            <div className="position-icon-position-title-block">
                                {positionIcon()}
                                <p className={`position ${mode === "Light" ? "light" : "dark"}`}>{user.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`requests-calendar-block`}>
                    <div className={`active-requests ${mode === "Light" ? "light" : "dark"}`}>
                        <div className={`active-requests-title`}>Active requests</div>
                        <div className={`requests-block`}>
                            {active_requests.length < 1 &&
                                <p className={`no-active-requests ${mode === "Light" ? "light" : "dark"}`}>No active
                                    requests...</p>}
                            {active_requests.map((request) => (

                                <div key={request.id} className={`request-block-justify`}>
                                    <div className={`request-block ${mode === "Light" ? "light" : "dark"}`}>
                                        <div className={`request-reason ${mode === "Light" ? "light" : "dark"}`}>
                                            {/*img*/}
                                            <p className={`request-reason-text ${mode === "Light" ? "light" : "dark"}`}>{request.reason}</p>
                                        </div>
                                        <div
                                            className={`request-main-info-block ${mode === "Light" ? "light" : "dark"}`}>
                                            <div className={`start-date-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>Start: </p>
                                                <p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}>{request.start_date}</p>
                                            </div>
                                            <div className={`end-date-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>End: </p>
                                                <p className={`detail-info ${mode === "Light" ? "light" : "dark"}`}>{request.end_date}</p>
                                            </div>
                                            <div className={`duration-request`}>
                                                <p className={`detail-title ${mode === "Light" ? "light" : "dark"}`}>Duration: </p>
                                                {calculateDifference(request.start_date, request.end_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`calendar-block`}>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}