import {useState} from "react";
import "./styles/Login.css"
import {useSelector} from "react-redux";
import {request} from "../axios_helper";
import {useNavigate} from "react-router-dom";

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [formIsValid, setFormIsValid] = useState(true);
    const mode = useSelector(state => state.mode)
    const navigate = useNavigate();

    const emailHandler = (event) => {
        event.preventDefault()
        setEmail(event.target.value)
    }

    const passwordHandler = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
    }

    const loginHandler = (event) => {
        event.preventDefault()

        if (email.trim().length === 0) {
            setErrors({email: "Email is empty"})
            setFormIsValid(false)
            return
        }
        if (password.trim().length === 0) {
            setErrors({password: "Password is empty"})
            setFormIsValid(false)
            return
        }

        setErrors({})
        setFormIsValid(true)

        request("POST", `/login`, {email: email, password: password})
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                console.log(res.data)
                navigate('/my-info')
                window.location.reload()
            })
            .catch((err) => {
                setErrors(err.response.data)
            })

    }

    return (
        <div className="main-block">
            <div className={`form-container ${mode === "Light" ? "light" : "dark"}`}>
                <div className="log-in-text">Log In</div>
                <form onSubmit={loginHandler}>
                    <div className="center-block">
                        <div className="email-block">
                            <label className="label" htmlFor="email">Email</label>
                            <input className={`input ${mode === "Light" ? "light" : "dark"}`} id="email" type="email" placeholder="name@example.com"
                                   onChange={emailHandler} value={email}/>
                            {errors.email && (<h3 className={`error-message`}>{errors.email}</h3>)}
                        </div>
                    </div>

                    <div className="center-block">
                        <div className="password-block">
                            <label className="label" htmlFor="password">Password</label>
                            <input className={`input ${mode === "Light" ? "light" : "dark"}`} id="password" type="password" placeholder="********"
                                   onChange={passwordHandler} value={password}/>
                            {errors.password && (<h3 className={`error-message`}>{errors.password}</h3>)}
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