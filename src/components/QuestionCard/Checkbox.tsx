import React from "react";

interface IQuestion {
  question: string;
  answers: string[];
  index: number;
  userAnswer?: string;
  setUserAnswer: (answer: string) => void;
}

const Checkbox: React.FC<IQuestion> = ({
  question,
  answers,
  index,
  userAnswer,
  setUserAnswer,
}) => {
  return (
    <div className="checkbox-group">
      <label>
        {" "}
        {index}- {question}{" "}
      </label>
      {answers.map((answer, i) => (
        <div className="checkbox-group__input" key={answer}>
          <input
            type="checkbox"
            name="circle"
            id={`${i}`}
            onChange={() => setUserAnswer(answer)}
            checked={userAnswer && answer === userAnswer ? true : false}
            disabled={userAnswer ? true : false}
          />
          <label htmlFor={`${i}`}>
            <span></span>
            {answer}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Checkbox;
