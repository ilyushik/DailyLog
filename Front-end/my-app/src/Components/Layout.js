import {Header} from "./Header";
import {useSelector} from "react-redux";
import "./Layout.css"
import banner from "../images/banner.png"

export function Layout(props) {
    const mode = useSelector(state => state.mode);

    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        return !!token;
    }

    return(
        <div className={`back ${mode === "Light" ? "light" : "dark"}`}>
            <Header />
            {isAuthenticated() && <img className="banner" src={banner} alt="banner"/>}
            <div className="content">
            <div className="content-center">
                    {props.children}
                </div>
            </div>
        </div>
    )
}