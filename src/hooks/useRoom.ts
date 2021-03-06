import { useContext, useEffect, useState } from "react";
import { Context } from "../contexts/AuthContextProvider";
import { database } from "../services/firebase";

type firebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;


  //hasLiked era uma condição para verificar se já havia sido 
  // hasLiked: boolean;
};

export const useRoom = (roomId: string) => {
  const { userAuth } = useContext(Context);

  const [question, setQuestion] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();

      const firebaseQuestions =
        (databaseRoom.questions as firebaseQuestions) ?? {};
      const firebaseTitle = databaseRoom.title;

      const parsedQuestion = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === userAuth?.id
            )?.[0],



            // essa funcao .some() estava retornando um boolean
            // hasLiked: Object.values(value.likes ?? {}).some(
            //   (like) => like.authorId === userAuth?.id
            // ),
          };
        }
      );

      setQuestion(parsedQuestion);
      setTitle(firebaseTitle);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, userAuth]);

  return { question, title };
};
