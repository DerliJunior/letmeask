import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import  '../../styles/auth.scss';


import ilustracao from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import Button from "../../Components/Button";
import { Context } from "../../contexts/AuthContextProvider";

const Home = () => {
  const navigate = useNavigate();

  const {userAuth, signInWithGoogle} = useContext(Context);

  const handleSubmit = async () => {
    if(!userAuth){
      await signInWithGoogle();
      
    }
    navigate('/rooms/new');

    
  }

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
          <button onClick={handleSubmit} className="create-room">
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o Google
            </button>
            <div className="separator">ou entre em uma sala</div>
            <form>
              <input type="text" placeholder="Digite o código da sala" />
              <Button type="submit">Entrar na sala</Button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
