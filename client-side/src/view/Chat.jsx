import React, { useContext, useRef, useState, useEffect } from "react";
import { BsContext, playSound } from "../stateManager/stateManager";
import styled, { keyframes } from "styled-components";
import { cool_shining_green } from "../styles/Mixins";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoCloseOutline, IoChatbox } from "react-icons/io5";
import { BiSend } from "react-icons/bi";
import Loader from "react-loader-spinner";
import { nanoid } from "nanoid";
import { flash } from "react-animations";
import bounceInUp from "react-animations/lib/bounce-in-up";

const flashAnimation = keyframes`${flash}`;
const fadeinupAnimation = keyframes`${bounceInUp}`;
let timer;

const ChatButton = () => {
  const { isChatShow, isOppTyping, chatAlert } = useContext(BsContext);
  if (isChatShow) {
    return <IoCloseOutline />;
  } else {
    if (isOppTyping) {
      if (chatAlert) {
        return (
          <Flash>
            <IoChatboxEllipses />
          </Flash>
        );
      } else {
        return <IoChatboxEllipses />;
      }
    } else {
      if (chatAlert) {
        return (
          <Flash>
            <IoChatbox />
          </Flash>
        );
      } else {
        return <IoChatbox />;
      }
    }
  }
};
const Chat = () => {
  const {
    chatText,
    setLastMessage,
    setChatText,
    isChatShow,
    setIsChatShow,
    chatAlert,
    setChatAlert,
    playSounds,
    bothPlayersConnected,
    isGameStarted,
    showModal,
    setIsTyping,
    isOppTyping,
  } = useContext(BsContext);
  const [chatTextWithoutLast, setChatTextWithoutLast] = useState([]);
  const [inputText, setInputText] = useState();
  const [lastMessageId, setLastMessageId] = useState();
  const inputTextHandler = () => {
    setInputText(event.target.value);
    if (event.target.value) {
      setIsTyping(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    } else {
      setIsTyping(false);
    }
  };
  const sendMessage = () => {
    if (chatInputRef.current.value) {
      let userMessage = {
        value: chatInputRef.current.value,
        user: "me",
      };
      setChatText([...chatText, userMessage]);
      setLastMessage(userMessage);
      chatInputRef.current.value = "";
      chatInputRef.current.focus();
      setInputText("");
      setLastMessageId(nanoid(4));
      setIsTyping(false);
    }
  };
  const MessageHandler = () => {
    if (event.keyCode == 13) {
      sendMessage();
    }
  };
  const chatInputRef = useRef();
  const showChat = () => {
    if (chatAlert) setChatAlert(false);
    setTimeout(() => {
      setIsChatShow(!isChatShow);
      if (chatInputRef.current) chatInputRef.current.focus();
    }, 100);
  };
  useEffect(() => {
    setLastMessageId(nanoid(4));
  }, []);

  useEffect(() => {
    if (chatText.length >= 1) {
      if (!isChatShow) {
        playSound("CHATMESSAGE", playSounds);
      }
      let items = [...chatText];
      items.pop();
      setChatTextWithoutLast([...items]);
      setLastMessageId(nanoid(4));
    }
  }, [chatText]);

  return (
    <>
      {bothPlayersConnected && !showModal && (
        <Design onClick={showChat} isChatShow={isChatShow}>
          <ChatButton />
        </Design>
      )}
      {isChatShow && !showModal && (
        <ChatBox isGameStarted={isGameStarted}>
          <ChatMessages>
            {chatTextWithoutLast.map((message) => (
              <MessageWrapper user={message.user}>
                <Message user={message.user} key={nanoid(8)}>
                  {message.value}
                </Message>
              </MessageWrapper>
            ))}
            {chatText[chatText.length - 1] && (
              <MessageWrapper user={chatText[chatText.length - 1].user}>
                <AnimatedMessage
                  key={lastMessageId}
                  user={chatText[chatText.length - 1].user}
                >
                  {chatText[chatText.length - 1].value}
                </AnimatedMessage>
              </MessageWrapper>
            )}
            {isOppTyping && (
              <Loader
                style={{
                  paddingLeft: "0.5vw",
                  position: "relative",
                  top: "1.1vw",
                }}
                type="ThreeDots"
                color="green"
                height={"4vw"}
                width={"4vw"}
              />
            )}
            {inputText && (
              <SendButton onClick={sendMessage}>
                <BiSend />
              </SendButton>
            )}
            <Input
              ref={chatInputRef}
              placeholder="Enter your message..."
              onKeyDown={MessageHandler}
              onChange={inputTextHandler}
            />
          </ChatMessages>
        </ChatBox>
      )}
    </>
  );
};

export default Chat;

const Design = styled.div`
  font-size: 2.5vw;
  width: 4vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 1000;
  justify-content: center;
  margin-top: -3vh;
  margin-left: 0vw;
  @media only screen and (max-width: 600px) {
    font-size: 8vw;
    width: 8vw;
    height: 8vw;
    margin-left: 0vw;
    margin: 4vw;
    ${({ isChatShow }) =>
      isChatShow &&
      `
`}
@media only screen and (max-height: 400px) {
margin-top: -1vh;
}

  &:hover {
    color: #1aff1a;
  }
  &:active {
    opacity: 0.4;
  }
`;
const ChatBox = styled.div`
  ${cool_shining_green};
  border: 3px solid #00ff3c;
  -webkit-box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
  box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
  border-radius: 2vw;
  height: 30vw;
  width: 30vw;
  margin-top: -60vh;
  margin-left: 1vw;
  background: #ece5dd;
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    position: relative;
    width: 90vw;
    left: 3vw;
    top: 3vh;
    min-height: 50vh;
  }
  @media only screen and (max-height: 400px) {
    min-height: 63vh;
    top: -16vw;
    // margin-top: -10vh;
  }
`;
const MessageWrapper = styled.div`
  display: flex;
  ${({ user }) =>
    user !== "me" && `margin-right: 0.5vw; justify-content: flex-end;`};
`;
const ChatMessages = styled.div``;
const Input = styled.input`
  height: 2vw;
  width: 28vw;
  border: 1px solid black;
  border-radius: 25px;
  margin: 0.7vw;
  // margin-bottom: 1vh;
  margin-top: 3vh;
  padding: 1vw;
  z-index: 10;
  font-size: 1.2vw;
  &:focus {
    outline: none;
  }
  ::placeholder {
    font-family: "Rajdhani", sans-serif;
  }
  @media only screen and (max-height: 400px) {
    // background: red;
    min-height: 7vh;
  }
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    padding: 1.5vw;
    width: 87vw;
    height: 5vh;
    margin-bottom: 1vw;
  } ;
`;
const Message = styled.div`
  display: table;
  margin-bottom: -1vw;
  margin-top: 1.3vw;
  border-radius: 5px;
  padding: 0.5vw;
  font-size: 1vw;
  color: black;
  font-weight: normal;
  border: 0.5px solid grey;
  margin-left: 0.8vw;
  background: ${({ user }) => (user === "me" ? `#93ecb3` : `white`)};
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    margin-top: 2vw;
  } ;
`;
const AnimatedMessage = styled(Message)`
  animation: 0.1s ${fadeinupAnimation};
  animation-iteration-count: 1;
`;
const SendButton = styled.div`
  position: relative;
  left: 26.5vw;
  color: green;
  bottom: -6.7vh;
  width: 2vw;
  height: 2vw;
  cursor: pointer;
  font-size: 2.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
    font-size: 10vw;
    bottom: -7.5vh;
    left: 80vw;
  }
  @media only screen and (max-height: 400px) {
    bottom: -9.5vh;
  }
`;
const Flash = styled.h1`
  animation: 2s ${flashAnimation};
  animation-iteration-count: infinite;
  font-size: 2.5vw;
  color: #00ff41;
  @media only screen and (max-width: 600px) {
    font-size: 8vw;
  }
`;
