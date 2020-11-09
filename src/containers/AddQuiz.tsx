import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";
import IllustratedImage from "../images/add-circle.svg";

const AddQuiz: React.FC<any> = ({ history }) => {
  const [quiz, setquiz] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [cookies] = useCookies(["token"]);

  const addQuiz = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quiz || !startDate || !endDate) setError(true);
    (async () => {
      let res = await axios.post(
        "/add-quiz",
        { name: quiz, startDate, endDate },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      if (res.data.isFailed) {
				setServerErrors(res.data.errors);
				setError(true);
			}
      else setSuccess(true);
    })();
  };

  return (
    <React.Fragment>
      <AdminNav />
      <main className="Add-circle">
        <h2>Add Quiz</h2>
        <img src={IllustratedImage} alt="Illustrated image" />
        <form onSubmit={(e) => addQuiz(e)}>
          <div className="text-input">
            <label htmlFor="name">Quiz name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => {
                setquiz(e.currentTarget.value);
                setServerErrors({});
              }}
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
            Add
          </button>
        </form>

        {success && (
          <Modal
            data="You successfully add quiz"
            action={() => history.push("/admin")}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default AddQuiz;
