import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";
import IllustratedImage from "../images/add-circle.svg";

const AddCircle: React.FC<any> = ({ history }) => {
  const [circle, setCircle] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token) history.push("/auth");
  }, [cookies.token, history])

  const submitCircle = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
    if (!circle) setError(true);
    else {
      (async () => {
        let res = await axios.post(
          "/add-circle",
          { name: circle },
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
          }
        );
        if (res.data.isFailed) {
          setError(true);
          setServerErrors(res.data.errors);
        }
        else setSuccess(true);
      })();
    }
  };

  return (
    <React.Fragment>
      <AdminNav />
      <main className="Add-circle">
        <h2>Add Circle</h2>
        <img src={IllustratedImage} alt="Illustrated svg of add circle" />
        <form onSubmit={(e) => submitCircle(e)}>
          <div className="text-input">
            <label htmlFor="name">Circle name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => {
                setCircle(e.currentTarget.value);
                setServerErrors({});
              }}
            />
            {error && (!circle || serverErrors.circle) && (
              <p className="error">
                *{serverErrors.circle || "You must type circle name"}
              </p>
            )}
          </div>
          <button className="btn btn__outline" type="submit">
            Add
          </button>
        </form>

        {success && (
          <Modal
            data="You successfully add circle"
            action={() => history.push("/admin")}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default AddCircle;
