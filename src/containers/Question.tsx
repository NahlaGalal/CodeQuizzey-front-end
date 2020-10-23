import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import Navbar from "../components/Navbar";
import QuestionCard from "../components/QuestionCard";

type answerType =
  | "Multiple choice"
  | "File"
  | "Short text"
  | "Long text"
  | "One choice"
  | "Code";

interface IQuestionsSchema {
  _id: string;
  question: string;
  answerType: answerType;
  answers?: string[];
  circleId: string;
  index: number;
}

const Question: React.FC<any> = ({ location, history }) => {
  const [qu, setQu] = useState<IQuestionsSchema>({
    question: "",
    _id: "",
    answerType: "Short text",
    circleId: "",
    answers: [],
    index: 1,
  });
  const [cookies] = useCookies(["name", "email", "circles"]);
  const [lastQuestion, setLastQuestion] = useState<boolean>(false);

  const getLinkAPI = () => {
    let circleId: string = new URLSearchParams(location.search).get(
      "circleId"
    ) as string;
    let quNo: string = new URLSearchParams(location.search).get(
      "quNo"
    ) as string;
    let linkAPI = circleId
      ? quNo
        ? `/question?circle=${circleId}&quNo=${quNo}&email=${cookies.email}`
        : `/question?circle=${circleId}&email=${cookies.email}`
      : !quNo
      ? `/question?email=${cookies.email}`
      : "/error";
    return [linkAPI, circleId];
  };

  useEffect(() => {
    if (!cookies.name) history.push("/");

    (async () => {
      const [linkApi, circleId] = getLinkAPI();
      let res = await axios.get(linkApi);
      if (!res.data.isFailed) {
        setQu(res.data.data.question);
        if (res.data.data.lastQuestion) setLastQuestion(true);
        else setLastQuestion(false);
      } else {
        const err = res.data.errors.data;
        if (err.startsWith("Question") && err.endsWith("solved")) {
          setQu({
            question: "",
            _id: "",
            answerType: "Short text",
            circleId,
            answers: [],
            index: +err.split(" ")[1],
          });
          setLastQuestion(res.data.errors.lastQuestion);
        } else if (err === "Wrong Circle id") {
          history.push("/error");
        }
      }
    })();
  }, [location.search, cookies.name, history]);

  const nextQuestion = () => {
    history.push({
      pathname: "/question",
      search: `?circleId=${qu.circleId}&quNo=${qu.index + 1}`,
    });
  };

  const prevQuestion = () => {
    history.push({
      pathname: "/question",
      search: `?circleId=${qu.circleId}&quNo=${qu.index - 1}`,
    });
  };

  const submitQuestion = (userAnswer: string) => {
    (async () => {
      let res = await axios.post("/question", {
        answer: userAnswer,
        questionId: qu._id,
        email: cookies.email,
      });
      if (lastQuestion)
        history.push({
          pathname: "/question",
          search: `?circleId=${qu.circleId}&quNo=${qu.index}`,
        });
        //FIXME: Submit last question in circle
      else
        history.push({
          pathname: "/question",
          search: `?circleId=${qu.circleId}&quNo=${qu.index + 1}`,
        });
    })();
  };

  return (
    <React.Fragment>
      <Navbar logoOnly={true} />
      <main className="Question">
        <header className="Question__btns">
          <button className="active">Non-technical Queustions</button>
          <button>Game Circle Questions</button>
          <button>Data Circle Questions</button>
        </header>

        <QuestionCard
          question={qu.question}
          index={qu.index}
          answerType={qu.answerType}
          answers={qu.answers}
          lastQuestion={lastQuestion}
          prevQuestion={prevQuestion}
          nextQuestion={nextQuestion}
          submitQuestion={(userAnswer) => submitQuestion(userAnswer)}
        />

        <footer>
          <button className="btn btn__solid">End Non-technical Quiz</button>
        </footer>
      </main>
    </React.Fragment>
  );
};

export default Question;
