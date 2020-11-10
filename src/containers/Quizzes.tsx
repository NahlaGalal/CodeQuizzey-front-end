import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import download from "downloadjs";
import axios from "../axiosInstance";
// Images
import AdminNav from "../components/AdminNav";
import menuIcon from "../images/three-dots.svg";
import editIcon from "../images/edit.svg";
import deleteIcon from "../images/delete.svg";
import downloadIcon from "../images/download.svg";
import standingsIcon from "../images/standing.svg";

interface IQuizzes {
  currentQuiz: {
    _id: string;
    name: string;
    endDate: string;
  };
  upcomingQuizzes: {
    _id: string;
    name: string;
    endDate: string;
    startDate: string;
  }[];
  previousQuizzes: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    responses: string[];
    circles: string[];
    topMember?: string;
    topCircle?: string;
  }[];
}

const Admin: React.FC<any> = ({ history }) => {
  const [cookies] = useCookies(["token"]);
  const [quizzes, setQuizzes] = useState<IQuizzes>();
  const [currentQuizId, setCurrentQuizId] = useState<string>("");
  const prevMenu = useRef<HTMLUListElement>(null);
  const comingMenu = useRef<HTMLUListElement>(null);
  const unmounted = useRef(false);

  useEffect(() => {
    if (!cookies.token) history.push("/auth");

    if (!unmounted.current) {
      (async () => {
        let res = await axios.get("http://localhost:4000/get-quizzes", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        setQuizzes(res.data.data);
      })();
    }

    return () => {
      unmounted.current = true;
    };
  }, [cookies.token, history]);

  const calculateDate = (d: string | undefined) => {
    if (!d) return;

    const date = new Date(new Date(d).getTime() - new Date().getTime());
    const remaining: string[] = [];
    // FIXME: Time!!

    if (date.getUTCDate()) remaining.push(`${date.getUTCDate() - 1}d`);
    if (date.getHours()) remaining.push(`${date.getHours()}h`);
    if (date.getMinutes()) remaining.push(`${date.getMinutes()}m`);

    return <span>{remaining.join(", ")}</span>;
  };

  const showPrevMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    quizId: string | undefined
  ) => {
    e.stopPropagation();
    const left = e.currentTarget.offsetLeft;
    const top = e.currentTarget.offsetTop;
    setCurrentQuizId(quizId || "");
    if (prevMenu.current?.style && prevMenu.current.offsetWidth) {
      if (
        prevMenu.current.style.left ===
        `${left - prevMenu.current.offsetWidth}px`
      ) {
        prevMenu.current.style.left = "-1000px";
        prevMenu.current.style.top = "-1000px";
      } else {
        prevMenu.current.style.left = `${
          left - prevMenu.current.offsetWidth
        }px`;
        prevMenu.current.style.top = `${top}px`;
      }

      if (comingMenu.current?.style && comingMenu.current.offsetWidth) {
        comingMenu.current.style.left = "-1000px";
        comingMenu.current.style.top = "-1000px";
      }
    }
  };

  const showComingMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    quizId: string
  ) => {
    e.stopPropagation();
    const left = e.currentTarget.offsetLeft;
    const top = e.currentTarget.offsetTop;
    setCurrentQuizId(quizId);
    if (comingMenu.current?.style && comingMenu.current.offsetWidth) {
      if (
        comingMenu.current.style.left ===
        `${left - comingMenu.current.offsetWidth}px`
      ) {
        comingMenu.current.style.left = "-1000px";
        comingMenu.current.style.top = "-1000px";
      } else {
        comingMenu.current.style.left = `${
          left - comingMenu.current.offsetWidth
        }px`;
        comingMenu.current.style.top = `${top}px`;
      }

      if (prevMenu.current?.style && prevMenu.current.offsetWidth) {
        prevMenu.current.style.left = "-1000px";
        prevMenu.current.style.top = "-1000px";
      }
    }
  };

  const hideMenus = () => {
    if (prevMenu.current?.style && prevMenu.current.offsetWidth) {
      prevMenu.current.style.left = "-1000px";
      prevMenu.current.style.top = "-1000px";
    }
    if (comingMenu.current?.style && comingMenu.current.offsetWidth) {
      comingMenu.current.style.left = "-1000px";
      comingMenu.current.style.top = "-1000px";
    }
  };

  const downloadResponses = () => {
    (async () => {
      const res = await axios.get(`/download?quizId=${currentQuizId}`, {
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
      const res = await axios.delete(
        `http://localhost:4000/delete-quiz?quizId=${currentQuizId}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );

      if (!res.data.isFailed) {
        const res2 = await axios.get("http://localhost:4000/get-quizzes", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        setQuizzes(res2.data.data);
      }
    })();
  };

  return (
    <React.Fragment>
      <AdminNav />
      <main className="Quizzes" onClick={hideMenus}>
        {/* Current Quiz */}
        <section className="Quizzes__section">
          <h2>Current Quiz</h2>
          {quizzes?.currentQuiz ? (
            <div className="Quizzes__section__box current">
              <h3>
                <Link to={`/quiz/${quizzes.currentQuiz._id}`}>
                  {quizzes?.currentQuiz.name}
                </Link>
              </h3>
              <div className="info">
                <p>Time remaining: </p>
                {calculateDate(quizzes?.currentQuiz.endDate)}
              </div>
              <button
                onClick={(e) => showPrevMenu(e, quizzes?.currentQuiz._id)}
              >
                <img src={menuIcon} alt="Menu icon" />
              </button>
            </div>
          ) : (
            <p className="Quizzes__empty"> No quizzes currently </p>
          )}
        </section>

        {/* Upcoming Quizzes */}
        <section className="Quizzes__section">
          <h2>Upcoming Quizzes</h2>
          <div className="Quizzes__section__container">
            {quizzes?.upcomingQuizzes.length ? (
              quizzes.upcomingQuizzes.map((quiz) => (
                <div className="Quizzes__section__box vertical" key={quiz._id}>
                  <div className="Quizzes__section__box__header">
                    <h3>
                      <Link to={`/quiz/${quiz._id}`}>{quiz.name}</Link>
                    </h3>
                    <button onClick={(e) => showComingMenu(e, quiz._id)}>
                      <img src={menuIcon} alt="Menu icon" />
                    </button>
                  </div>
                  <div className="info">
                    <p>Start date:</p>
                    <span>{quiz.startDate}</span>
                  </div>
                  <div className="info">
                    <p>End date:</p>
                    <span>{quiz.endDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="Quizzes__empty"> No upcoming quizzes </p>
            )}
          </div>
        </section>

        {/* Previous Quizzes */}
        <section className="Quizzes__section">
          <h2>Previous Quizzes</h2>
          <div className="Quizzes__section__container">
            {quizzes?.previousQuizzes.length ? (
              quizzes.previousQuizzes.map((quiz) => (
                <div className="Quizzes__section__box vertical" key={quiz._id}>
                  <div className="Quizzes__section__box__header">
                    <h3>
                      <Link to={`/quiz/${quiz._id}`}>{quiz.name}</Link>
                    </h3>
                    <button onClick={(e) => showPrevMenu(e, quiz._id)}>
                      <img src={menuIcon} alt="Menu icon" />
                    </button>
                    <span className="Quizzes__section__box__header__statistics">
                      {quiz.circles.length} circles, {quiz.responses.length}{" "}
                      responses
                    </span>
                  </div>
                  <div className="info">
                    <p>Top member: </p>
                    {quiz.topMember ? (
                      <span>{quiz.topMember}</span>
                    ) : (
                      <span className="unkown"> Not known yet</span>
                    )}
                  </div>
                  <div className="info">
                    <p>Top circle: </p>
                    {quiz.topCircle ? (
                      <span>{quiz.topCircle}</span>
                    ) : (
                      <span className="unkown"> Not known yet</span>
                    )}
                  </div>
                  <div className="info">
                    <p>Start date:</p>
                    <span>{quiz.startDate}</span>
                  </div>
                  <div className="info">
                    <p>End date:</p>
                    <span>{quiz.endDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="Quizzes__empty"> No quizzes previously </p>
            )}
          </div>
        </section>

        {/* Upcoming quiz menu */}
        <ul className="menu" ref={comingMenu}>
          <li>
            <Link to={`/edit-quiz`}>
              <button>
                <img src={editIcon} alt="Edit icon" />
                Edit Quiz
              </button>
            </Link>
          </li>
          <li>
            <button onClick={deleteQuiz}>
              <img src={deleteIcon} alt="Delete icon" />
              Delete Quiz
            </button>
          </li>
        </ul>

        {/* Current and previous quiz menu */}
        <ul className="menu" ref={prevMenu}>
          <li>
            <button onClick={downloadResponses}>
              <img src={downloadIcon} alt="Download icon" />
              Download responses
            </button>
          </li>
          <li>
            <Link to={`/standings/${currentQuizId}`}>
              <button>
                <img src={standingsIcon} alt="Standings icon" />
                Show standings
              </button>
            </Link>
          </li>
        </ul>
      </main>
    </React.Fragment>
  );
};

export default Admin;
