import React, { useState } from "react";
import iconLeft from "../../images/fe_arrow-left.svg";
import iconRight from "../../images/fe_arrow-right.svg";
import Checkbox from "./Checkbox";
import Code from "./Code";
import File from "./File";
import LongText from "./LongText";
import RadioBtn from "./RadioBtn";
import ShortText from "./ShortText";

type answerType =
  | "Multiple choice"
  | "File"
  | "Short text"
  | "Long text"
  | "One choice"
  | "Code";

interface IQuestionsSchema {
  question: string;
  answerType: answerType;
  answers?: string[];
  index: number;
  lastQuestion: boolean;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuestion: (userAnswer: string | File) => void;
}

const QuestionCard: React.FC<IQuestionsSchema> = ({
  question,
  index,
  answerType,
  answers,
  lastQuestion,
  nextQuestion,
  prevQuestion,
  submitQuestion,
}) => {
  const [userAnswer, setUserAnswer] = useState<string | File>("");

  return (
    <div className="Question__card">
      {question ? (
        answerType === "One choice" ? (
          <RadioBtn
            question={question}
            index={index}
            answers={answers || []}
            setUserAnswer={setUserAnswer}
          />
        ) : answerType === "Multiple choice" ? (
          <Checkbox
            question={question}
            index={index}
            answers={answers || []}
            setUserAnswer={setUserAnswer}
          />
        ) : answerType === "Code" ? (
          <Code
            question={question}
            index={index}
            setUserAnswer={setUserAnswer}
          />
        ) : answerType === "Long text" ? (
          <LongText
            question={question}
            index={index}
            setUserAnswer={setUserAnswer}
          />
        ) : answerType === "Short text" ? (
          <ShortText
            question={question}
            index={index}
            setUserAnswer={setUserAnswer}
          />
        ) : (
          <File
            question={question}
            index={index}
            setUserAnswer={setUserAnswer}
          />
        )
      ) : (
        <p className="Question__card__submitted">
          {index}- This question submitted before{" "}
        </p>
      )}

      <div className="Question__card__controls">
        <button
          className={`btn ${index === 1 ? "btn__disallow" : "btn__solid"}`}
          onClick={prevQuestion}
          disabled={index === 1}
        >
          <img src={iconLeft} alt="Icon left" />
          Back
        </button>
        <button
          className={`btn ${!question ? "btn__disallow" : "btn__outline"}`}
          onClick={() => submitQuestion(userAnswer)}
        >
          {" "}
          Submit
        </button>
        <button
          className={`btn ${lastQuestion ? "btn__disallow" : "btn__solid"}`}
          onClick={nextQuestion}
          disabled={lastQuestion}
        >
          Next
          <img src={iconRight} alt="Icon right" />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
