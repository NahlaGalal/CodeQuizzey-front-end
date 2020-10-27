import React, { useEffect, useRef, useState } from "react";
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
  const [activeCircle, setActiveCircle] = useState<string>("");
  const [lastQuestion, setLastQuestion] = useState<boolean>(false);
  // To forbid showing questions when user ends the quiz or solve all questions
  const [end, setEnd] = useState<boolean>(false);
  // To reload page when submit last question
  const [reload, setReload] = useState<boolean>(false);
  // Unmount component
  const unmounted = useRef(false);

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

    if (!unmounted.current) {
      setEnd(false);
      (async () => {
        const [linkApi, circleId] = getLinkAPI();
        let res = await axios.get(linkApi);
        setActiveCircle(circleId || "5f90db8465a68c35f49cb3bf");
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
          } else if (err === "All questions solved") {
            setEnd(true);
          }
        }
      })();
    }

    return () => {
      unmounted.current = true;
    };
  }, [location.search, cookies.name, history, reload]);

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

  const submitQuestion = (userAnswer: string | File | null) => {
    const data = new FormData();
    data.append("answer", userAnswer as string);
    data.append("questionId", qu._id);
    data.append("email", cookies.email);

    (async () => {
      await axios.post("/question", data);
      if (lastQuestion) setReload(!reload);
      else
        history.push({
          pathname: "/question",
          search: `?circleId=${qu.circleId}&quNo=${qu.index + 1}`,
        });
    })();
  };

  const changeCircle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    history.push({
      pathname: "/question",
      search: `?circleId=${e.currentTarget.dataset.id}`,
    });
  };

  const endQuiz = () => {
    (async () => {
      let res = await axios.get(
        `/end-quiz?circle=${activeCircle}&email=${cookies.email}`
      );
      if (!res.data.isFailed) setEnd(true);
    })();
  };

  return (
    <React.Fragment>
      <Navbar logoOnly={true} />
      <main className="Question">
        <header className="Question__btns">
          <button
            className={`${
              activeCircle === "5f90db8465a68c35f49cb3bf" && "active"
            }`}
            data-id="5f90db8465a68c35f49cb3bf"
            onClick={changeCircle}
          >
            Non-technical Questions
          </button>
          {cookies.circles?.map((circle: { id: string; name: string }) => (
            <button
              data-id={circle.id}
              key={circle.id}
              onClick={changeCircle}
              className={`${activeCircle === circle.id && "active"}`}
            >
              {circle.name} Questions
            </button>
          ))}
        </header>

        {!end ? (
          <React.Fragment>
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
              <button className="btn btn__solid" onClick={endQuiz}>
                End{" "}
                {cookies.circles?.find(
                  (circle: { name: string; id: string }) =>
                    circle.id === activeCircle
                )?.name || "Non-technical"}{" "}
                Quiz
              </button>
            </footer>
          </React.Fragment>
        ) : (
          <p className="end-quiz"> This quiz ended </p>
        )}
      </main>
    </React.Fragment>
  );
};

export default Question;
