import React from "react";

interface IQuestion {
  question: string;
  index: number;
  setUserAnswer: (answer: string) => void;
}

const ShortText: React.FC<IQuestion> = ({ question, index, setUserAnswer }) => {
  return (
    <div className="text-input">
      <label htmlFor="answer">
        {index}- {question}
      </label>
      <input
        type="text"
        name="answer"
        id="answer"
        onChange={(e) => setUserAnswer(e.currentTarget.value)}
      />
    </div>
  );
};

export default ShortText;
