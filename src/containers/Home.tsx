import React, { useEffect, useState } from "react";
import axios from "axios";
import IllustratedImage from "../images/undraw_Choose_bwbs.svg";

interface ICircle {
  name: string;
  _id: string;
}

const Home: React.FC = () => {
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [circlesChecked, setCirclesChecked] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<any>({});

  useEffect(() => {
    (async () => {
      let res = await axios.get("http://localhost:4000/");
      // let res = await axios.get("http://192.168.1.5:4000/");
      setCircles(res.data);
    })();
  }, []);

  const checkCircle = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    let circle: string = e.currentTarget.id;
    setServerErrors({});
    if (e.currentTarget.checked) {
      if (circlesChecked.length === 2) e.preventDefault();
      else setCirclesChecked([...circlesChecked, circle]);
    } else {
      let circlesCheckedCopy = [...circlesChecked];
      let circleIndex = circlesCheckedCopy.findIndex((c) => c === circle);
      circlesCheckedCopy.splice(circleIndex, 1);
      setCirclesChecked([...circlesCheckedCopy]);
    }
  };

  const submitBasicData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(true);
    if (name && email && circlesChecked.length) {
      (async () => {
        const inputs = {
          name,
          email,
          circles: [...circlesChecked],
        };
        let res = await axios.post("http://localhost:4000/", inputs);
        let { data } = res;
        if (data.isFailed) setServerErrors(data.error);
      })();
    }
  };

  return (
    <main className="Home">
      <img src={IllustratedImage} alt="Illustrated svg" />
      <form onSubmit={(e) => submitBasicData(e)}>
        <div className="text-input">
          <label htmlFor="name">Your name</label>
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
              *{serverErrors.name || "You must type your name"}
            </p>
          )}
        </div>
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
          {error && (!email || serverErrors.email) && (
            <p className="error">
              *{serverErrors.email || "You must type your email"}
            </p>
          )}
        </div>
        <div className="checkbox-group">
          <label>Technical circles</label>
          <span>You can choose one or two circles only</span>
          {circles.map((circle: ICircle) => (
            <div className="checkbox-group__input" key={circle._id}>
              <input
                type="checkbox"
                name="circle"
                id={circle._id}
                onClick={(e) => checkCircle(e)}
              />
              <label htmlFor={circle._id}>
                <span></span>
                {circle.name}
              </label>
            </div>
          ))}
          {error && (!circlesChecked.length || serverErrors.circle) && (
            <p className="error">
              *{serverErrors.circle || "You must choose one or two circles"}
            </p>
          )}
        </div>
        <button className="btn btn__outline" type="submit">
          Next
        </button>
      </form>
    </main>
  );
};

export default Home;
