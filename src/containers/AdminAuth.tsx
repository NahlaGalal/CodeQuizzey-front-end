import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import IllustratedImage from "../images/undraw_Choose_bwbs.svg";
import axios from "../axiosInstance";
import { useCookies } from "react-cookie";

const AdminAuth: React.FC<any> = ({ history }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});
  const [cookies, setCookies] = useCookies(["name"]);

  useEffect(() => {
    if (cookies.token) history.push("/admin");
  }, [cookies.token, history]);

  const submitBasicData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(true);
    if (email && password) {
      (async () => {
        const inputs = {
          email,
          password,
        };
        let res = await axios.post("/auth", inputs);
        let { data } = res;
        if (data.isFailed) setServerErrors(data.errors);
        else {
          setCookies("token", data.data.token);
          history.push("/admin");
        }
      })();
    }
  };

  return (
    <React.Fragment>
      <Navbar name="CAT Race"/>
      <main className="Home">
        <img src={IllustratedImage} alt="Illustrated svg" />
        <form onSubmit={(e) => submitBasicData(e)}>
          <div className="text-input">
            <label htmlFor="email">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setServerErrors({});
              }}
            />
            {error && (!email || serverErrors?.email) && (
              <p className="error">
                *{serverErrors.email || "You must type your email"}
              </p>
            )}
          </div>
          <div className="text-input">
            <label htmlFor="password">Your password</label>
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
                *{serverErrors.password || "You must type your email"}
              </p>
            )}
          </div>
          <button className="btn btn__outline" type="submit">
            Login
          </button>
        </form>
      </main>
    </React.Fragment>
  );
};

export default AdminAuth;
