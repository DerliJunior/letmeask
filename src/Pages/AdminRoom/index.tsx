import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import empty from "../../assets/images/delete.svg";

import Dialog from "@mui/material/Dialog";

import Button from "../../Components/Button";
import RoomCode from "../../Components/RoomCode";
import Question from "../../Components/Question";

import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";

import ExcluirQuestao from "./ExcluirQuestao";

import "../../styles/room.scss";

type RoomParams = {
  id: string;
};

const AdminRoom = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [questionId, setQuestionId] = useState<string>("");

  const navigate = useNavigate();

  const params = useParams<RoomParams>();
  const roomId = String(params.id);
  const { title, question } = useRoom(roomId);

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    navigate("/");
  };

  const handleRemoveQuestion = async (idQuestion: string) => {
    await setOpen(true);
    await setQuestionId(idQuestion);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logo} alt="Logo header" />
            <div>
              <RoomCode id={roomId} />
              <Button onClick={handleEndRoom}>Encerrar sala</Button>
            </div>
          </div>
        </header>

        <main>
          <div className="room-title">
            <h2>{title}</h2>
            <span>
              {question.length > 0
                ? `${question.length} pergunta(s)`
                : ` Nenhuma pergunta`}
            </span>
          </div>
          <div className="question-list">
            {question.map((questoes) => (
              <Question content={questoes.content} author={questoes.author}>
                <button onClick={() => handleRemoveQuestion(questoes.id)}>
                  <img src={empty} alt="Icone de lixeira" />
                </button>
              </Question>
            ))}
          </div>
        </main>
      </div>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <ExcluirQuestao
          close={handleClose}
          questionId={questionId}
          roomId={roomId}
        />
      </Dialog>
    </>
  );
};

export default AdminRoom;
