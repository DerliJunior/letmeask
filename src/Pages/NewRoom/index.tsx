import React, { useContext, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../Components/Button";
import illustration from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";

import "../../styles/auth.scss";

import { Context } from "../../contexts/AuthContextProvider";
import { database } from "../../services/firebase";

const NewRoom = () => {
  const { userAuth } = useContext(Context);

  const [room, setRoom] = useState<string>("");
  
  const navigate = useNavigate();

  const HandleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(event.target.value);
    console.log(event.target.value);
  };
  
  const createRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (room.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: room,
      authorId: userAuth?.id,
    });

    navigate(`/rooms/${firebaseRoom.key}`)
    
  };



  if (!userAuth) <div>Carregando pagina</div>;
  return (
    <div id="page-auth">
      <aside>
        <img src={illustration} alt="Imagem lateral" />
        <strong>Titulo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
        <div>{userAuth?.name}</div>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo" />
          <h2>nome da sala</h2>
          <form onSubmit={createRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={HandleChangeForm}
              value={room}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default NewRoom;
