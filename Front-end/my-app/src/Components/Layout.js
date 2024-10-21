import {Header} from "./Header";
import {useSelector} from "react-redux";
import "./Layout.css"
import banner from "../images/banner.png"

const user = {
    id: 1,
    name: "Illia",
    surname: "Kamarali"
}

export function Layout(props) {
    const mode = useSelector(state => state.mode);
    return(
        <div className={`back ${mode === "Light" ? "light" : "dark"}`}>
            <Header />
            {user.id && <img className="banner" src={banner} alt="banner"/>}
            <div className="content">
            <div className="content-center">
                    {props.children}
                </div>
            </div>
        </div>
    )
}