import {useState} from "react";
import "./styles/Login.css"
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [formIsValid, setFormIsValid] = useState(true);
    const mode = useSelector(state => state.theme.theme);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword(true);
    }

    const hidePasswprdHandler = () => {
        setShowPassword(false);
    }

    const emailHandler = (event) => {
        event.preventDefault()
        setEmail(event.target.value)
    }

    const passwordHandler = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
    }

    const loginHandler = async (event) => {
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

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/login`, {email: email, password: password})
            localStorage.setItem('token', response.data.token)
            console.log(response.data)
            navigate('/my-info')
            window.location.reload()
        } catch (error) {
            setErrors(error.response.data)
        }

    }

    return (
        <div className="main-block">
            <div className={`form-container ${mode === "light" ? "light" : "dark"}`}>
                <div className="log-in-text">Log In</div>
                <form onSubmit={loginHandler}>
                    <div className="center-block">
                        <div className="email-block">
                            <label className="label" htmlFor="email">Email</label>
                            <input className={`input ${mode === "light" ? "light" : "dark"}`} id="email" type="email" placeholder="name@example.com"
                                   onChange={emailHandler} value={email}/>
                            {errors.email && (<h3 className={`error-message`}>{errors.email}</h3>)}
                        </div>
                    </div>

                    <div className="center-block">
                        <div className="password-block">
                            <label className="label" htmlFor="password">Password</label>
                            <div className={`input-img`}>
                                <input className={`input ${mode === "light" ? "light" : "dark"}`} id="password"
                                       type={showPassword ? "text" : "password"} placeholder={showPassword ? "password" : "********"}
                                       onChange={passwordHandler} value={password}/>
                                {showPassword && <button onClick={hidePasswprdHandler} className={`far fa-eye eye-icon ${mode === "light" ? "light" : "dark"}`}></button>}
                                {!showPassword && <button onClick={showPasswordHandler} className={`far fa-eye-slash eye-icon ${mode === "light" ? "light" : "dark"}`}></button>}
                            </div>
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