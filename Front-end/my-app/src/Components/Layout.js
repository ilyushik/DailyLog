import {Header} from "./Header";
import {useSelector} from "react-redux";
import "./Layout.css"
import banner from "../images/banner.png"

export function Layout(props) {
    const mode = useSelector(state => state.mode);
    return(
        <div className={`back ${mode === "Light" ? "light" : "dark"}`}>
            <Header />
            <img className="banner" src={banner} alt="banner" />
            <div className="content">
                <div className="content-center">
                    {props.children}
                </div>
            </div>
        </div>
    )
}