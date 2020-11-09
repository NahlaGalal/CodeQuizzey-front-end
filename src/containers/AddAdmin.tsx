import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "../axiosInstance";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";
import IllustratedImage from "../images/add-circle.svg";

const AddAdmin: React.FC<any> = ({ history }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [cookies] = useCookies(["token"]);

  const addAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) setError(true);
    (async () => {
      let res = await axios.post(
        "/add-admin",
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
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
        <h2>Add Admin</h2>
        <img src={IllustratedImage} alt="Illustrated svg of add admin" />
        <form onSubmit={(e) => addAdmin(e)}>
          <div className="text-input">
            <label htmlFor="name">Admin name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => {
                setName(e.currentTarget.value);
                setServerErrors({});
              }}
            />
            {error && (!name || serverErrors.name) && (
              <p className="error">
                *{serverErrors.name || "You must type quiz name"}
              </p>
            )}
          </div>
          <div className="text-input">
            <label htmlFor="email">Admin email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setServerErrors({});
              }}
            />
            {error && (!email || serverErrors.email) && (
              <p className="error">
                *{serverErrors.email || "You must choose start date"}
              </p>
            )}
          </div>
          <div className="text-input">
            <label htmlFor="password">Admin password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.currentTarget.value);
                setServerErrors({});
              }}
            />
            {error && (!password || serverErrors.password) && (
              <p className="error">
                *{serverErrors.password || "You must choose end date"}
              </p>
            )}
          </div>
          <button className="btn btn__outline" type="submit">
            Add
          </button>
        </form>

        {success && (
          <Modal
            data="You successfully add admin"
            action={() => history.push("/admin")}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default AddAdmin;
