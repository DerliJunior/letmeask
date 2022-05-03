import React, { FormEvent, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import ilustracao from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import "../../styles/auth.scss";

import Button from "../../Components/Button";
import { Context } from "../../contexts/AuthContextProvider";
import { database } from "../../services/firebase";

const Home = () => {
  const [roomCode, setRoomCode] = useState<string>("");

  const navigate = useNavigate();

  const { userAuth, signInWithGoogle } = useContext(Context);

  const HandleSignIn = async () => {
    if (!userAuth) {
      await signInWithGoogle();
    }
    navigate("/rooms/new");
  };

  const HandleEnterRoomCode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoomCode(event.target.value);
      console.log(event.target.value)
    },
    []
  );

  const HandleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    console.log(roomRef);
    if (!roomRef.exists()) {
      alert("Sala não existe.");

      return;
    }

    const firebaseRoom = await database.ref('rooms');

    firebaseRoom.key?.substring(1,5)

    navigate(`/rooms/${roomCode}`);
  };

  return (
    <div id="page-auth">
      <aside>
        <img src={ilustracao} alt="Imagem lateral" />
        <strong>Titulo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo" />
          <button onClick={HandleSignIn} className="create-room">
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={HandleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={HandleEnterRoomCode}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
