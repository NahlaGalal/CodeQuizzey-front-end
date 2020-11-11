import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";
import IllustratedImage from "../images/add-circle.svg";

const AddQuiz: React.FC<any> = ({ history, match }) => {
  const [quiz, setQuiz] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [cookies] = useCookies(["token"]);

  const path = match.path === "/edit-quiz/:id" ? "edit" : "add";

  useEffect(() => {
    if (!cookies.token) history.push("/auth");

    if (path === "edit") {
      (async () => {
        let res = await axios.get(`/edit-quiz?quizId=${match.params.id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        if (!res.data.isFailed) {
          setQuiz(res.data.data.name);
          setStartDate(
            res.data.data.startDate.split(":").splice(0, 2).join(":")
          );
          setEndDate(res.data.data.endDate.split(":").splice(0, 2).join(":"));
        }
      })();
    }
  }, [cookies.token, history]);

  const addQuiz = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quiz || !startDate || !endDate) setError(true);

    const data =
      path === "add"
        ? { name: quiz, startDate, endDate }
        : { name: quiz, startDate, endDate, quizId: match.params.id };

    (async () => {
      let res = await axios.post("/add-quiz", data, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      if (res.data.isFailed) {
        setServerErrors(res.data.errors);
        setError(true);
      } else setSuccess(true);
    })();
  };

  return (
    <React.Fragment>
      <AdminNav />
      <main className="Add-circle">
        <h2>Add Quiz</h2>
        <img src={IllustratedImage} alt="Illustrated svg of add quiz" />
        <form onSubmit={(e) => addQuiz(e)}>
          <div className="text-input">
            <label htmlFor="name">Quiz name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => {
                setQuiz(e.currentTarget.value);
                setServerErrors({});
              }}
              defaultValue={quiz}
            />
            {error && (!quiz || serverErrors.quiz) && (
              <p className="error">
                *{serverErrors.quiz || "You must type quiz name"}
              </p>
            )}
          </div>
          <div className="text-input">
            <label htmlFor="start">Start date</label>
            <input
              type="datetime-local"
              name="start"
              id="start"
              onChange={(e) => {
                setStartDate(e.currentTarget.value);
                setServerErrors({});
              }}
              min={new Date().toISOString().split(":").splice(0, 2).join(":")}
              defaultValue={startDate}
            />
            {error && (!startDate || serverErrors.startDate) && (
              <p className="error">
                *{serverErrors.startDate || "You must choose start date"}
              </p>
            )}
          </div>
          <div className="text-input">
            <label htmlFor="end">End date</label>
            <input
              type="datetime-local"
              name="end"
              id="end"
              onChange={(e) => {
                setEndDate(e.currentTarget.value);
                setServerErrors({});
              }}
              value={endDate}
              min={
                startDate
                  ? startDate
                  : new Date().toISOString().split(":").splice(0, 2).join(":")
              }
            />
            {error && (!endDate || serverErrors.endDate) && (
              <p className="error">
                *{serverErrors.endDate || "You must choose end date"}
              </p>
            )}
          </div>
          <button className="btn btn__outline" type="submit">
            {path === "add" ? "Add" : "Edit"}
          </button>
        </form>

        {success && (
          <Modal
            data={`You successfully ${path === "add" ? "add" : "edit"} quiz`}
            action={() => history.push("/admin")}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default AddQuiz;
