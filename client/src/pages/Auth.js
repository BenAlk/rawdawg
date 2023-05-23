import {useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'

export const Auth = () => {
    const [method, setMethod] = useState(true)

    return <div className="auth">
        {method ? <Login switchSubmit={setMethod}/> : <Register switchSubmit={setMethod}/>}
    </div>
}

const Login = ({switchSubmit}) => {    
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate()

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                password
        })


        if(response.data.userID){
            setCookies("access_token", response.data.token)
            window.localStorage.setItem("userID", response.data.userID)
            navigate("/")
        } else {
            alert(response.data.message)
        }
        } catch(err) {
        console.error(err)
        }
    }

    const handleSwitchSubmit = () => {
        switchSubmit(false);
    }

    return <Form
    username={username}
    setUsername={setUsername}
    password={password}
    setPassword={setPassword}
    label="Login"
    switchLabel="Not registered? Click here"
    onSubmit={onSubmit}
    switchSubmit={handleSwitchSubmit}
/>
}


const Register = ({switchSubmit}) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            await axios.post("http://localhost:3001/auth/register", {
                username,
                password
            })
            alert("Registration completed! You can now login")
            handleSwitchSubmit()
        } catch(err) {
            if (err.response && err.response.status === 400) {
                alert(err.response.data.message); // display the error message from the server
                } else {
                alert("An error occurred while registering. Please try again later.");
        }

    }
    }
    const handleSwitchSubmit = () => {
        switchSubmit(true);
    };

    return <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label="Register"
        switchLabel="Already registered? Click here"
        onSubmit={onSubmit}
        switchSubmit={handleSwitchSubmit}
    />
    
}

const Form = ({username,
    setUsername,
    password,
    setPassword,
    label,
    switchLabel,
    onSubmit,
    switchSubmit
}) => {
    return(
        <div className="auth-container">
            <form onSubmit={onSubmit}>
                <h2>{label}</h2>
                <div className="form-group">
                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={(event) => setUsername(event.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} 
                    />
                </div>
                <div className="form-buttons">
                    <button className="form-button" type="submit">{label}</button>
                    <button className="form-button" type="button" onClick={switchSubmit}>{switchLabel}</button>
                </div>
            </form>
        </div>
    )
}