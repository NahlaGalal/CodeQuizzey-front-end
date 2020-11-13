import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import download from "downloadjs";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";

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
  index: number;
}

const Quiz: React.FC<any> = ({ history, match }) => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [circles, setCircles] = useState<{ name: string; _id: string }[]>([]);
  const [quiz, setQuiz] = useState<{ name: string; state: string }>({
    name: "",
    state: "",
  });
  const [questions, setQuestions] = useState<IQuestionDetails[]>([]);

  useEffect(() => {
    if (!cookies.token) history.push("/auth");

    (async () => {
      let res = await axios.get(`/quiz?quizId=${match.params.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (!res.data.isFailed) {
        setCircles(res.data.data.circles);
        setQuestions(res.data.data.questions);
        setQuiz(res.data.data.quiz);
      }
    })();
  }, [cookies.token, history, match.params.id]);

  const downloadResponses = () => {
    (async () => {
      const res = await axios.get(`/download?quizId=${match.params.id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment",
          filename: "file.xlsx",
        },
        responseType: "blob",
      });

      download(res.data, "file.xlsx");
    })();
  };

  const deleteQuiz = () => {
    (async () => {
      const res = await axios.delete(`/delete-quiz?quizId=${match.params.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      if (!res.data.isFailed) history.push("/admin");
    })();
  };

  const deleteQuestion = (questionId: string) => {
    (async () => {
      const res = await axios.delete(
        `/delete-question?questionId=${questionId}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );

      if (!res.data.isFailed) {
        const res2 = await axios.get(`/quiz?quizId=${match.params.id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        if (!res2.data.isFailed) {
          setCircles(res2.data.data.circles);
          setQuestions(res2.data.data.questions);
        }
      }
    })();
  };

  const logout = () => {
    (async () => {
      let res = await axios.get(`/logout?token=${cookies.token}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (!res.data.isFailed) {
        removeCookie("token");
        history.push("/auth");
      }
    })();
  };

  return (
    <React.Fragment>
      <AdminNav logout={logout} />
      <main className="Quiz">
        <header>
          <h2>{quiz.name}</h2>
          <p>{quiz.state}</p>
        </header>

        <section>
          <ul>
            {circles.map((circle) => (
              <li key={circle._id}>
                &gt; {circle.name}
                <ul>
                  {questions
                    .filter(
                      (question) =>
                        question.circleId.toString() === circle._id.toString()
                    )
                    .map((question) => (
                      <li key={question._id}>
                        {question.index}- {question.question}
                        <span>
                          <Link to={`/edit-question/${question._id}`}>
                            Edit question
                          </Link>
                          <button onClick={() => deleteQuestion(question._id)}>
                            Delete question
                          </button>
                        </span>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <footer>
          {quiz.state === "Upcoming quiz" ? (
            <React.Fragment>
              <Link to={`/add-question/${match.params.id}`}>
                <button className="btn btn__solid">Add question</button>
              </Link>
              <Link to={`/edit-quiz/${match.params.id}`}>
                <button className="btn btn__solid">Edit quiz</button>
              </Link>
              <button className="btn btn__solid" onClick={deleteQuiz}>
                Delete quiz
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link to={`/standings/${match.params.id}`}>
                <button className="btn btn__solid">Show standings</button>
              </Link>
              <button className="btn btn__solid" onClick={downloadResponses}>
                Download responses
              </button>
            </React.Fragment>
          )}
        </footer>
      </main>
    </React.Fragment>
  );
};

export default Quiz;
