import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./AuthForm.module.css"
import axios from "axios"




const signupContent = {
    title: "Signup",
    route: "signup",
    buttonText: "Signup"
}

const signinContent = {
    title: "Signin",
    route: "signin",
    buttonText: "Signin"
}



const AuthForm = ({formType, setToken}) => {
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [message, setMessage] = useState("")

const content = formType === "signup" ? signupContent : signinContent

    const handleSubmit = (e) => {
        e.preventDefault()
        

    axios.post(`https://capstone-backend-blush.vercel.app/${content.route}`, {
        email,
        password
    }).then((res) => {
        if(formType === "signup"){
            setMessage(res.data.message)
        } else {
            document.cookie = `token=${res.data.token}`
            setToken(res.data.token)
            navigate("/")//navigate to dashboard
            }
        })
}

  return (
    <div id="form-container">
        <form onSubmit={handleSubmit}>
            <h2>{content.title}</h2>
            <label className={styles.label}>
                Email:
                <input type="email" onChange={(e) => setEmail(e.target.value)} required/>
            </label>


            <label className={styles.label}>
                Password
                <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
            </label>
            <input type="submit" value={content.buttonText}/>
        </form>
    </div>
  )
}

export default AuthForm