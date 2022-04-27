import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Button from "../../Components/Button";
import illustration from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";

import  '../../styles/auth.scss';

import { Context } from "../../contexts/AuthContextProvider";


const NewRoom = () => {
  const {userAuth} = useContext(Context);

  if(!userAuth) (
    <div>Carregando pagina</div>
  )
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
            <form>
              <input type="text" placeholder="Digite o código da sala" />
              <Button type="submit">Criar sala</Button>
            </form>
            <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
};

export default NewRoom;
