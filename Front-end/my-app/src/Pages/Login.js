import {useState} from "react";
import "./styles/Login.css"
import {useSelector} from "react-redux";

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const mode = useSelector(state => state.mode)

    const emailHandler = (event) => {
        event.preventDefault()
        setEmail(event.target.value)
    }

    const passwordHandler = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
    }

    return (
        <div className="main-block">
            <div className={`form-container ${mode === "Light" ? "light" : "dark"}`}>
                <div className="log-in-text">Log In</div>
                <form>
                    <div className="center-block">
                        <div className="email-block">
                            <label className="label" htmlFor="email">Email</label>
                            <input className={`input ${mode === "Light" ? "light" : "dark"}`} id="email" type="email" placeholder="name@example.com"
                                   onChange={emailHandler} value={email}/>
                        </div>
                    </div>

                    <div className="center-block">
                        <div className="password-block">
                            <label className="label" htmlFor="password">Password</label>
                            <input className={`input ${mode === "Light" ? "light" : "dark"}`} id="password" type="password" placeholder="********"
                                   onChange={passwordHandler} value={password}/>
                        </div>
                    </div>

                    <div className="button-block">
                        <button>Login to account</button>
                    </div>
                </form>
            </div>
        </div>
    )
}