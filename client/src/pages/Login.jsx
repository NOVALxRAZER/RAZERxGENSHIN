import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { login } from "../redux/apiCalls"
import { mobile } from "../responsive"
import { useHistory } from "react-router"
import GoogleIcon from '@mui/icons-material/Google';
import TextField from '@mui/material/TextField';
import { baseURL } from "../requestMethods"
import RazerBG from "../images/razerbg1.jpg"

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: url(${RazerBG}) center;
    background-size: 100vw 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Wrapper = styled.div`
    width: 25%;
    padding: 20px;
    background-color: #e5fae5;
    border-radius: 10px;
    ${mobile({ width: "75%" })}
`
const Title = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
`
const Form = styled.div`
    display: flex;
    flex-direction: column;
`
const Label = styled.span`
    font-size: 15px;
    font-weight: 400;
    margin-top: 10px;
    margin-bottom: 15px;
    margin-left: 5px;
    color: #636363;
`
const Button = styled.button`
    width: 190px;
    border: none;
    padding: 15px 20px;
    background-color: #039e03;
    color: white;
    margin-bottom: 10px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    &:disabled{
        cursor: not-allowed;
    }
`
const Link = styled.a`
    margin: 5px 0px;
    font-size: 15px;
    cursor: pointer;
    color: inherit;
`
const Error = styled.span`
    color: red;
    margin-top: 15px;
`
const Center = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
`
const Or = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: gray;
    font-weight: bold;
`
const GoogleButton = styled.button`
    background-color: red;
    border: none;
    width: 200px;
    height: 47px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 10px;
    cursor: pointer;
`
const Span = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-top: 5px;
    margin-bottom: 5px;
`
const RegisterButton = styled.button`
    background-color: blue;
    border: none;
    width: 100%;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 15px;
    text-decoration: none;
    margin-bottom: 10px;
    cursor: pointer;
`

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username });
    const [errors1, setErrors1] = useState({ password });
    const [values, setValues] = useState({
        username: '',
        password: '',
    })
    const dispatch = useDispatch();
    const history = useHistory();
    const { isFetching, error } = useSelector((state) => {
        return state.user
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors({ username: '' })
        setUsername(e.target.value);
    }

    const handleChange1 = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        setErrors1({ password: '' })
        setPassword(e.target.value);
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (!username) {
            setErrors({ username: "Username is Required!" })
        } if (!password) {
            setErrors1({ password: "Password is Required!" })
        } if (values.username && values.password) {
            login(dispatch, {
                ...values,
            })
            history.push("http://151.106.120.124/");
        }
    };

    const google = () => {
        window.open(`/auth/google`, "_self")
    }

    return (
        <Container>
            <Wrapper>
                <Title>LOGIN TO YOUR ACCOUNT</Title>
                <Form>
                    <Label>Username</Label>
                    <TextField
                        label="Username"
                        id="outlined-basic"
                        type="text"
                        name="username"
                        onChange={handleChange}
                        required
                        error={Boolean(errors?.username)}
                        helperText={(errors?.username)}
                    />
                    <Label>Password</Label>
                    <TextField
                        label="Password"
                        id="outlined-basic"
                        type="password"
                        name="password"
                        onChange={handleChange1}
                        required
                        error={Boolean(errors1?.password)}
                        helperText={(errors1?.password)}
                    />
                    {error && <Error>Username or Password is Wrong</Error>}
                    <Center>
                        <Button onClick={handleClick} disabled={isFetching}>LOGIN</Button>
                        <Or>OR</Or>
                        <GoogleButton onClick={google}><GoogleIcon style={{ marginLeft: "-10px", marginRight: "10px" }} />Login With Google</GoogleButton>
                    </Center>
                    <Span>Don't have any Account?</Span>
                    <Link href="/register">
                        <RegisterButton>Create a New Account</RegisterButton>
                    </Link>
                </Form>
            </Wrapper>
        </Container>
    )
}
