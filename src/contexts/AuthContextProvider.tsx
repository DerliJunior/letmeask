import React, { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type AuthContextProviderProps = {
  children: ReactNode;
};

// Tipagem do que será enviado pelo nosso Context
// estou enviando o [userAth] e a função signInWithGoogle()
// Quando se usa função assincrona, devemos sempre retornar ela como Promise
// e o tipo dela, sempre () => void.
type ContextTypes = {
  userAuth: UserAuthTypes | undefined;
  signInWithGoogle: () => Promise<void>;
};

type UserAuthTypes = {
  id: string;
  name: string;
  avatar: string;
};

export const Context = createContext({} as ContextTypes);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  // Estado que estou armazenando o array com informações do usuario google
  const [userAuth, setUserAuth] = useState<UserAuthTypes>();

  // É uma boa prática guardar um event listener dentro de uma variável,
  // pois quando aquele estado não existir mais, ele sair de dentro do
  // useEffect.
  useEffect(() => {
    // Essa const verificado se eu estou autenticado naquela sessão e
    // reinsere os valores em "Cache" e não precisar relogar
    
    const unsubscribe = auth.onAuthStateChanged((userOn) => {
      // Se retornar um valor eu desestruturo  para validar se cada item
      // é diferente de True
      if (userOn) {
        const { displayName, photoURL, uid } = userOn;

        if (!displayName || !photoURL) {
          throw new Error("Informações incompletadas do google.");
        }
        // Setando os valores novamente no nosso state.
        setUserAuth({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Função assincrona
  const signInWithGoogle = async () => {
    // Provider do google que contem as informações de acesso
    const provider = new firebase.auth.GoogleAuthProvider();
    // Popup de login
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Informações incompletadas do google.");
      }
      //Inserindo dados dentro do array do estado criado
      setUserAuth({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  };
  
  return (
    // Para que todos os componentes filhos receba informações do context
    // preciso passar um children como value e tudo dentro do Context
    // será acessado.
    <Context.Provider value={{ userAuth, signInWithGoogle }}>
      {children}
    </Context.Provider>
  );
};

export default AuthContextProvider;
