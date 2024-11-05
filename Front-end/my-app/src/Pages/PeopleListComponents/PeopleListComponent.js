import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import "./PeopleListComponent.css"
import job_icon_light from "../../images/position-icon.svg"
import job_icon_dark from "../../images/position-icon-dark.svg"

export function PeopleListComponent(props) {
    const mode = useSelector(state => state.mode);

    const positionIconMode = () => {
        if (mode === "Light") {
            return(<img className="position-icon" src={job_icon_light} alt="position-icon" />)
        } else {
            return(<img className="position-icon" src={job_icon_dark} alt="position-icon" />)
        }
    }

    return (
        <div className={`person-block ${mode === "Light" ? "light" : "dark"}`} key={props.key}>
            <div className={`person-info-block`}>
                <div className={`person-image`}>
                    <img className={`person-img`} src={props.user.image} alt="" />
                </div>

                <div className={`person-info`}>
                    <div className={`person-data ${mode === "Light" ? "light" : "dark"}`}>
                        <p className={`person-name ${mode === "Light" ? "light" : "dark"}`}>{props.user.firstName}</p>
                        <p className={`person-surname ${mode === "Light" ? "light" : "dark"}`}>{props.user.secondName}</p>
                    </div>

                    <div className={`person-job`}>
                        {positionIconMode()}
                        <p className={`person-position ${mode === "Light" ? "light" : "dark"}`}>{props.user.position}</p>
                    </div>
                </div>
            </div>

            <div className={`link-info-block ${mode === "Light" ? "light" : "dark"}`}>
                <Link to={`/user/${props.user.id}`}>
                    <p>Learn more</p>
                </Link>
            </div>
        </div>
    )
}