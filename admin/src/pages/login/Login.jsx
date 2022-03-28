import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { login } from "../../redux/apiCalls"
import { mobile } from "../../responsive"
import { useHistory } from "react-router"
import TextField from '@mui/material/TextField';
import RazerBG from "../../images/razerbg1.jpg"

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
const Error = styled.span`
    color: red;
    margin-top: 15px;
`
const Center = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
`

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username });
    const [errors1, setErrors1] = useState({ password });
    const [notAdmin, setNotAdmin] = useState("");
    const [falseAdmin, setFalseAdmin] = useState(false);
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const dispatch = useDispatch();
    const history = useHistory();
    const { isFetching, error, currentUser } = useSelector((state) => {
        return state.user
    });

    // useEffect((state) => {
    //     if (state.user.currentUser.isAdmin === false) {
    //         setNotAdmin("You're Not Admin or Authenticated!")
    //         setFalseAdmin(true);
    //     }
    // }, [setNotAdmin])

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

    const handleClick = (e, state) => {
        e.preventDefault();
        if (!username) {
            setErrors({ username: "Username is Required!" })
        } if (!password) {
            setErrors1({ password: "Password is Required!" })
        } if (values.username && values.password) {
            login(dispatch, {
                ...values,
            })
        } else if (state.user.currentUser.isAdmin === false) {
            setNotAdmin("You're Not Admin or Authenticated!")
            setFalseAdmin(true);
        }
    };

    useEffect(() => {
        if (currentUser) {
            history.push("http://151.106.120.124/");
        }
    }, [currentUser, history])

    return (
        <Container>
            <Wrapper>
                <Title>LOGIN TO ADMIN ACCOUNT</Title>
                <Form>
                    <Label>Username</Label>
                    <TextField
                        label="Username"
                        id="outlined-basic"
                        type="text"
                        name="username"
                        onChange={handleChange}
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
                        error={Boolean(errors1?.password)}
                        helperText={(errors1?.password)}
                    />
                    {error && <Error>Username or Password is Wrong</Error>}
                    {falseAdmin && <Error>{notAdmin}</Error>}
                    <Center>
                        <Button onClick={handleClick} disabled={isFetching}>LOGIN</Button>
                    </Center>
                </Form>
            </Wrapper>
        </Container>
    )
}
