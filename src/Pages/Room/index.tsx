import React, { FormEvent, useState, useContext, useEffect } from "react";

import { useParams } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import Button from "../../Components/Button";
import RoomCode from "../../Components/RoomCode";
import { Context } from "../../contexts/AuthContextProvider";
import { database } from "../../services/firebase";

import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

const Room = () => {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const [newQuestion, setNewQuestion] = useState("");

  const { userAuth } = useContext(Context);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.once('value', (room) => {
      console.log(room.val());
      // const parsedQuestion = Object.entries(room.questions ?? {})
    })
  }, [roomId])

  const HandleWriteText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewQuestion(event.target.value);
    console.log(event.target.value);
  };

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!userAuth) {
      throw new Error();
    }

    const question = {
      content: newQuestion,
      author: {
        name: userAuth.name,
        avatar: userAuth.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    console.log(userAuth.avatar);

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Logo header" />
          <RoomCode id={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h2>Sala React</h2>
          <span>5 perguntas</span>
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que gostaria de perguntar?"
            onChange={HandleWriteText}
            value={newQuestion}
          />
          <div className="form-footer">
            {userAuth ? (
              <div className="user-info">
                <img src={userAuth.avatar} alt={userAuth.name} />
                <span>{userAuth.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>Faça seu login</button>.
              </span>
            )}

            <Button type="submit">Fazer pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Room;
