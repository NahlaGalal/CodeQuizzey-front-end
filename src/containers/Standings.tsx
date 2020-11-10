import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import QuestionCard from "../components/QuestionCard";

type answerType =
  | "Multiple choice"
  | "File"
  | "Short text"
  | "Long text"
  | "One choice"
  | "Code";

interface IQuestionDetails {
  answers: string[];
  _id: string;
  circleId: string;
  question: string;
  answerType: answerType;
  quizId: string;
  index: number;
}

interface IResponses {
  _id: string;
  name: string;
  email: string;
  solvedQuestions: {
    questionId: string;
    answer: string;
    quizId: string;
    circle: string;
    questionDetails: IQuestionDetails;
  }[];
}

const Standings: React.FC<any> = ({ match }) => {
  const [cookies] = useCookies(["token"]);
  const [responses, setResponses] = useState<IResponses[]>();
  const [circles, setCircles] = useState<string[]>([]);
  const [questionCard, setQuestionCard] = useState<IQuestionDetails & {userAnswer: string}>({
    quizId: "",
    question: "",
    answers: [],
    _id: "",
    circleId: "",
    answerType: "Short text",
    index: 1,
    userAnswer: ""
  });
  const [showQuestionCard, setShowQuestionCard] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let res = await axios.get(`/responses?quizId=${match.params.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (!res.data.isFailed) setResponses(res.data.data.responses);
      const circles = new Set<string>();
      res.data.data.responses.map((res: IResponses) =>
        res.solvedQuestions.map((qu) => circles.add(qu.circle))
      );
      setCircles(Array.from(circles));
    })();
  }, []);

  const showQuestion = (details: IQuestionDetails, userAnswer: string) => {
    setQuestionCard({...details, userAnswer});
    setShowQuestionCard(true);
  };

  return (
    <React.Fragment>
      <AdminNav />
      <main className="Standings">
        <header>
          <h2>CAT Race 1.0.0</h2>
          <p>Current quiz</p>
        </header>

        <table>
          <thead>
            <tr>
              <th className="id">Id</th>
              <th>Name</th>
              <th>Email</th>
              <th className="large">Circle</th>
              <th className="id">Question index</th>
              <th className="large">Question & answer</th>
            </tr>
          </thead>
          <tbody>
            {responses?.map((response, n) => {
              let user = false;
              return circles.map((circle) => {
                let circleB = false;
                let qusCircle = response.solvedQuestions.filter(
                  (qu) => qu.circle === circle
                );
                if (qusCircle) {
                  return qusCircle.map((qu) => {
                    if (!user) {
                      user = true;
                      circleB = true;
                      return (
                        <tr key={qu.questionId}>
                          <td rowSpan={response.solvedQuestions.length}>
                            {n + 1}
                          </td>
                          <td rowSpan={response.solvedQuestions.length}>
                            {response.name}
                          </td>
                          <td rowSpan={response.solvedQuestions.length}>
                            {response.email}
                          </td>
                          <td rowSpan={qusCircle.length}>{circle}</td>
                          <td>{qu.questionDetails.index}</td>
                          <td>
                            <button
                              className="btn btn__outline"
                              onClick={() =>
                                showQuestion(qu.questionDetails, qu.answer)
                              }
                            >
                              View answer
                            </button>
                          </td>
                        </tr>
                      );
                    } else {
                      if (!circleB) {
                        circleB = true;
                        return (
                          <tr key={qu.questionId}>
                            <td rowSpan={qusCircle.length}>{circle}</td>
                            <td>{qu.questionDetails.index}</td>
                            <td>
                              <button
                                className="btn btn__outline"
                                onClick={() =>
                                  showQuestion(qu.questionDetails, qu.answer)
                                }
                              >
                                View answer
                              </button>
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={qu.questionId}>
                            <td>{qu.questionDetails.index}</td>
                            <td>
                              <button
                                className="btn btn__outline"
                                onClick={() =>
                                  showQuestion(qu.questionDetails, qu.answer)
                                }
                              >
                                View answer
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    }
                  });
                }
              });
            })}
          </tbody>
        </table>

        {showQuestionCard && (
          <div className="Standings__question">
            <button
              className="Standings__question__close"
              onClick={() => setShowQuestionCard(false)}
            >
              &times;
            </button>
            <QuestionCard
              question={questionCard.question}
              answerType={questionCard.answerType}
              index={questionCard.index}
              answers={questionCard.answers}
              overlayBox={true}
              uAnswer={questionCard.userAnswer}
            />
          </div>
        )}
      </main>
    </React.Fragment>
  );
};

export default Standings;
