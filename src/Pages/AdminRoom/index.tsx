import React, { FormEvent, useState, useContext } from "react";

import { useParams } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import Button from "../../Components/Button";
import Question from "../../Components/Question";
import RoomCode from "../../Components/RoomCode";
import { Context } from "../../contexts/AuthContextProvider";
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

const AdminRoom = () => {
  const params = useParams<RoomParams>();
  const roomId = String(params.id);

  const [newQuestion, setNewQuestion] = useState("");

  const { userAuth } = useContext(Context);

  const { title, question } = useRoom(roomId);

  const HandleWriteText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewQuestion(event.target.value);
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

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Logo header" />
          <div>
            <RoomCode id={roomId} />
            <Button>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h2>{title}</h2>
          <span>
            {question.length > 0
              ? `${question.length} pergunta(s)`
              : ` Nenhuma pergunta`}{" "}
          </span>
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
        <div className="question-list">
          {question.map((questoes) => (
            <Question content={questoes.content} author={questoes.author} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminRoom;
