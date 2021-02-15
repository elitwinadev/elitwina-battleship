import React, { useContext, useRef, useState, useEffect } from "react";
import styled, { keyframes } from 'styled-components';
import { BsContext } from "../stateManager/stateManager";
import { InputButton } from '../styles/GlobalStyles';
import { pulse } from 'react-animations';
const { REACT_APP_SERVER_URL } = process.env;
const pulseAnimation = keyframes`${pulse}`;
const Auth = () => {


    const username = useRef(null);
    const password = useRef(null);
    const passwordAgain = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [bigMsg, setBigMsg] = useState();



    const {
        isLoginShow,
        isRegisterShow,
        setIsRegisterShow
    } = useContext(BsContext);
    const newUser = () => {
        setErrorMsg('');
        setIsRegisterShow(true);
    }



    const formHandler = async () => {
        setErrorMsg('Loading...')
        event.preventDefault();
        const data = {
            username: username.current.value,
            password: password.current.value
        }
        const data_url = `${REACT_APP_SERVER_URL}/login`;
        const response = await fetch(data_url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result) {
            localStorage.setItem('token', result);
            location.reload();
        }
        else {
            setErrorMsg(<p>Invaild user details.</p>)
        }
    }




    const formHandlerRegister = async () => {
        event.preventDefault();
        if (username.current.value.length < 3) {
            setErrorMsg("Username is too short!");
            username.current.focus();
            return false;
        }
        if (password.current.value.length < 5) {
            setErrorMsg("Password must have 5 letters or more!");
            password.current.focus();
            return false;
        }
        if (password.current.value !== passwordAgain.current.value) {
            setErrorMsg("Passwords are not equal!");
            passwordAgain.current.focus();
            return false;
        }
        setErrorMsg('Loading...');
        const data = {
            username: username.current.value,
            password: password.current.value
        }
        const data_url = `${REACT_APP_SERVER_URL}/register`;
        const response = await fetch(data_url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result === "OK") {
            setErrorMsg("OK");
            setIsRegisterShow(false);
            username.current.value = data.username;
            password.current.value = data.password;
            setErrorMsg();
            setBigMsg(
                <><P>Welcome!</P><P>Now you are one of our friends!</P><P>Click Login and start playing!</P><P></P></>)
        }
        else { setErrorMsg(<p>Choose another username</p>) }
    }


    
    if (isLoginShow) {
        return (
            <AuthWrapper>
                {!isRegisterShow ? <><Form onSubmit={formHandler}>
                    {bigMsg && <h1>{bigMsg}</h1>}
                    <Input ref={username} placeholder="User name"></Input>
                    <Input type="password" placeholder="Password" ref={password}></Input>
                    <InputButton type="submit" value="Login" />
                    {errorMsg && <Error>{errorMsg}</Error>}
                </Form>
                    <Span onClick={newUser}>Not have an account? Sign Up!</Span></>
                    :
                    <>
                        <h1>Register a new user</h1>
                        <Form onSubmit={formHandlerRegister}>
                            <Input ref={username} placeholder="User name"></Input>
                            <Input type="password" placeholder="Password" ref={password}></Input>
                            <Input type="password" placeholder="Your password again" ref={passwordAgain}></Input>
                            <InputButton type="submit" value="Register" />
                            {errorMsg && <Error>{errorMsg}</Error>}
                        </Form>
                        <Span onClick={newUser}>Not have an account? Sign Up!</Span></>
                }
            </AuthWrapper>
        )
    }
    return <h1></h1>
}
export default Auth;

const Form = styled.form`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-bottom: 2vw;
`

const Input = styled.input`
// width: 100%;
width: 20vw;
height: 4vh;
margin: 0.5vh;
font-size: 1.5vw;
padding: 0.5vw;
background: none;
border: 1px solid white;
border-radius: 25px;
color: white;
::placeholder {
    color: grey;
}
&:focus {
    border: none;
    border: 1px dashed white;
    outline: none;
}
@media only screen and (max-width: 600px) {
    width: 30vw;
    font-size: 3vw;
}
`
const AuthWrapper = styled.div`
position: fixed;
width: 100vw;
height: 90vh;
z-index: 999999999;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background: #202124;
margin-top: 10vh;
`
const Error = styled.div`
color: red;
font-size: 3vw;
margin-top: 1vw;
`
const Span = styled.span`
cursor: pointer;
`
const P = styled.p`
animation: ${pulseAnimation} 2s;
animation-iteration-count: infinite;
font-size: 4vw;
@media only screen and (max-width: 600px) {
    font-size: 6vw;
}
`