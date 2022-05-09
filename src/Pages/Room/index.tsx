import React, { FormEvent, useState, useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";

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

const Room = () => {
  const params = useParams<RoomParams>();
  const roomId = String(params.id);

  const [newQuestion, setNewQuestion] = useState("");

  const { userAuth, signInWithGoogle } = useContext(Context);

  const { title, question } = useRoom(roomId);

  const navigate = useNavigate();

  const handleWriteText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewQuestion(event.target.value);
  };

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!userAuth) {
      alert("Faça login para enviar pergunta.");
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

  const handleLikeQuestion = async (
    questionId: string,
    likeId: string | undefined
  ) => {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: userAuth?.id,
      });
    }
  };

  const handleSignInWithGoogle = async () => {
    const roomRef = await database.ref(`rooms/${roomId}`).get();

    if (!userAuth) {
      await signInWithGoogle();
      throw new Error();
    }

    if(roomRef.val().authorId === userAuth?.id){
      navigate(`/admin/rooms/${roomId}`);
    }else {
      navigate(`/rooms/${roomId}`);
    }
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
            onChange={handleWriteText}
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
                Para enviar uma pergunta,{" "}
                <button onClick={handleSignInWithGoogle}>Faça seu login</button>
                .
              </span>
            )}

            <Button type="submit">Fazer pergunta</Button>
          </div>
        </form>
        <div className="question-list">
          {question.map((questoes) => (
            <Question
              key={questoes.id}
              content={questoes.content}
              author={questoes.author}
            >
              <button
                className="like-button"
                type="button"
                onClick={() =>
                  handleLikeQuestion(questoes.id, questoes?.likeId)
                }
              >
                {questoes.likeCount > 0 && <span>{questoes.likeCount}</span>}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Room;
