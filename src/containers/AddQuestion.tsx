import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";
import IllustratedImage from "../images/add-question.svg";

type answerType =
  | "Multiple choice"
  | "File"
  | "Short text"
  | "Long text"
  | "One choice"
  | "Code";

const AddQuestion: React.FC<any> = ({ history, match }) => {
  const [question, setQuestion] = useState<string>("");
  const [circle, setCircle] = useState<{ name: string; _id: string }>({
    name: "",
    _id: "",
  });
  const [answerType, setAnswerType] = useState<answerType>("Short text");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [index, setIndex] = useState<number>();
  const [circles, setCircles] = useState<{ name: string; _id: string }[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [cookies, , removeCookie] = useCookies(["token"]);

  const path = match.path === "/edit-question/:id" ? "edit" : "add";

  useEffect(() => {
    if (!cookies.token) history.push("/auth");

    (async () => {
      let res = await axios.get("/add-question", {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (!res.data.isFailed) {
        setCircles(res.data.data);
      }
      if (path === "edit") {
        let res2 = await axios.get(
          `/edit-question?questionId=${match.params.id}`,
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
          }
        );
        if (!res2.data.isFailed) {
          setCircle(res2.data.data.circle);
          setQuestion(res2.data.data.question.question);
          setAnswerType(res2.data.data.question.answerType);
          setIndex(res2.data.data.question.index);
          setAnswers(res2.data.data.question.answers);
        }
      }
    })();
  }, [cookies.token, history]);

  const getIndex = (circleId: string) => {
    (async () => {
      let res = await axios.get(
        `/get-Index?quizId=${match.params.id}&circleId=${circleId}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      if (!res.data.isFailed) setIndex(res.data.data.index);
    })();
  };

  const addQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const quAnswers = answers.filter((answer) => answer !== "");
    if (
      !question ||
      !circle ||
      !answerType ||
      !index ||
      ((answerType === "Multiple choice" || answerType === "One choice") &&
        quAnswers.length < 2)
    )
      setError(true);
    else {
      if (path === "add") {
        let data: {
          quizId: string;
          question: string;
          circleId: string;
          answerType: answerType;
          index: number;
          answers?: string[];
        } = {
          quizId: match.params.id,
          question,
          circleId: circle._id,
          answerType,
          index,
        };
        if (
          quAnswers.length &&
          (answerType === "Multiple choice" || answerType === "One choice")
        )
          data.answers = quAnswers;

        (async () => {
          let res = await axios.post("/add-question", data, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          if (res.data.isFailed) setServerErrors(res.data.errors);
          else setSuccess(true);
        })();
      } else {
        let data: {
          questionId: string;
          question: string;
          answerType: answerType;
          answers?: string[];
        } = {
          questionId: match.params.id,
          question,
          answerType,
        };
        if (
          quAnswers.length &&
          (answerType === "Multiple choice" || answerType === "One choice")
        )
          data.answers = quAnswers;

        (async () => {
          let res = await axios.post("/edit-question", data, {
            headers: { Authorization: `Bearer ${cookies.token}` },
          });
          if (res.data.isFailed) setServerErrors(res.data.errors);
          else setSuccess(true);
        })();
      }
    }
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
      <main className="Add-circle">
        <h2>Add Question</h2>
        <img src={IllustratedImage} alt="Illustrated svg of add question" />
        <form onSubmit={(e) => addQuestion(e)}>
          {/* Select circle */}
          <div className="select-input">
            <label htmlFor="circle">Circle</label>
            <select
              name="circle"
              id="circle"
              onChange={(e) => {
                getIndex(e.currentTarget.value);
                setCircle({
                  _id: e.currentTarget.value,
                  name: e.currentTarget.selectedOptions[0].textContent || "",
                });
                setServerErrors({});
              }}
              value={circle._id}
              disabled={path === "edit" ? true : false}
            >
              <option value="" disabled>
                Choose circle
              </option>
              {circles.map((c) => (
                <option value={c._id} key={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {error && (!circle._id || serverErrors.circle) && (
              <p className="error">
                *{serverErrors.circle || "You must choose circle name"}
              </p>
            )}
          </div>

          {/* Index */}
          <div className="read-only-input">
            <label htmlFor="index">Index</label>
            <p className="input">{index}</p>
            {error && (!index || serverErrors.index) && (
              <p className="error">
                *
                {serverErrors.index ||
                  "You must choose circle name to specify index"}
              </p>
            )}
          </div>

          {/* Question */}
          <div className="text-input">
            <label htmlFor="question">Question</label>
            <input
              type="text"
              name="question"
              id="question"
              onChange={(e) => {
                setQuestion(e.currentTarget.value);
                setServerErrors({});
              }}
              defaultValue={question}
            />
            {error && (!question || serverErrors.question) && (
              <p className="error">
                *{serverErrors.question || "You must type question"}
              </p>
            )}
          </div>

          {/* Answer type */}
          <div className="select-input">
            <label htmlFor="type">Answer type</label>
            <select
              name="type"
              id="type"
              onChange={(e) => {
                setAnswerType(e.currentTarget.value as answerType);
                setServerErrors({});
              }}
              defaultValue={answerType}
            >
              <option value="" disabled defaultChecked>
                Choose answer type
              </option>
              <option value="Multiple choice">Multiple choice</option>
              <option value="One choice">One choice</option>
              <option value="Short text">Short text</option>
              <option value="Long text">Long text</option>
              <option value="File">File</option>
              <option value="Code">Code</option>
            </select>
            {error && (!answerType || serverErrors.answerType) && (
              <p className="error">
                *{serverErrors.answerType || "You must choode answer type"}
              </p>
            )}
          </div>

          {/* Answers */}
          {(answerType === "Multiple choice" ||
            answerType === "One choice") && (
            <div className="text-input">
              <label htmlFor="answer1">
                Answers<span>You must type at least two answers</span>
              </label>
              <input
                type="text"
                name="answer1"
                id="answer1"
                onChange={(e) => {
                  let answersCopy = [...answers];
                  answersCopy[0] = e.currentTarget.value;
                  setAnswers(answersCopy);
                  setServerErrors({});
                }}
                defaultValue={answers[0]}
              />
              <input
                type="text"
                name="answer2"
                id="answer2"
                onChange={(e) => {
                  let answersCopy = [...answers];
                  answersCopy[1] = e.currentTarget.value;
                  setAnswers(answersCopy);
                  setServerErrors({});
                }}
                defaultValue={answers[1]}
              />
              <input
                type="text"
                name="answer3"
                id="answer3"
                onChange={(e) => {
                  let answersCopy = [...answers];
                  answersCopy[2] = e.currentTarget.value;
                  setAnswers(answersCopy);
                  setServerErrors({});
                }}
                defaultValue={answers[2]}
              />
              <input
                type="text"
                name="answer4"
                id="answer4"
                onChange={(e) => {
                  let answersCopy = [...answers];
                  answersCopy[3] = e.currentTarget.value;
                  setAnswers(answersCopy);
                  setServerErrors({});
                }}
                defaultValue={answers[3]}
              />
              {error &&
                (answers.filter((ans) => ans !== "").length < 2 ||
                  serverErrors.answers) && (
                  <p className="error">
                    *
                    {serverErrors.answers ||
                      "You must type answers or change answer type"}
                  </p>
                )}
            </div>
          )}

          <button className="btn btn__outline" type="submit">
            {path === "add" ? "Add" : "Edit"}
          </button>
        </form>

        {success && (
          <Modal
            data={
              path === "add"
                ? "You successfully add question"
                : "You successfully edit question"
            }
            action={() => history.push("/admin")}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default AddQuestion;
