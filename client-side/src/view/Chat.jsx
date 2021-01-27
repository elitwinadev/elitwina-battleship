import React, { useContext, useRef, useState } from "react";
import { BsContext } from "../stateManager/stateManager";
import { Button } from "../styles/GlobalStyles";
import styled from "styled-components";
import { flex, position, cool_shining_green } from "../styles/Mixins";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { BiSend } from "react-icons/bi";

const Chat = () => {
    const { setShowModal } = useContext(BsContext);
    const [isShow, setIsShow] = useState(false);
    return (
        <>
            <ChatButton onClick={() => setIsShow(!isShow)}>
                {isShow ? <IoCloseOutline /> : <IoChatboxEllipsesOutline />}
            </ChatButton>
            {isShow ? <ChatBox>
                <ChatMessages>
                    <Message user="me">hey1</Message>
                    <Message user="him">hey2</Message>
                    <Message user="me">hey3</Message>
                    <Input placeholder="Enter your message..." />
                    <Send/>
                </ChatMessages>

            </ChatBox> : ' '}
        </>
    );
};

export default Chat;

const ChatButton = styled.div`
font-size: 4vw;
cursor: pointer;
display: flex;
align-items: center;
position: absolute;
top: 65.5vw;
right: 117vw;
z-index: 100;
justify-content: center;
@media only screen and (max-width: 600px) {
  top: 96vw;
  right: 58vw;
  font-size: 5vw;
}

&:hover {
    color: #1aff1a;
  }
  &:active {
    opacity: 0.4;
  }

`
const ChatBox = styled.div`
${cool_shining_green};
border: 3px solid #00ff3c;
-webkit-box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
border-radius: 2vw;
height: 45vw;
width: 45vw;
background: #ECE5DD;
right: 76vw;
top: 19.4vw;
position: absolute;
z-index: 100;
display: flex;
flex-direction: column-reverse;
`
const ChatMessages = styled.div`
`
const Input = styled.input`
height: 3vw;
width: 98%;
border: 1px solid black;
border-radius: 25px;
margin: 0.5vw;
// margin-left: 1vw;
padding: 1vw;
font-size: 1.5vw;
margin-top: 1vw;
&:focus {
    outline: none;
}
::placeholder {
    font-family: 'Rajdhani', sans-serif;
}
`
const Message = styled.h1`
margin-left: 1.5vw;
margin: 0.5vw;
border-radius: 10px;
padding: 0.5vw;
font-size: 1.5vw;
color: black;
border: 1px solid #a6a6a6;

background: ${(props) => (props.user === "me" ? "#25D366" : "white")};
`
const Send = styled(BiSend)`
position: absolute;
color: black;
top: 41.4vw;
right: 1.5vw;
border-radius: 100%;
background: #00ff41;
// display: flex;
// justify-content: center;
// align-content: center;
// padding: 0.1vw;
// width: 3vw;
// height: 3vw;
padding: 0.5vw;
font-size: 2.5vw;

`