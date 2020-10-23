import React from "react";

interface IQuestion {
  question: string;
  index: number;
  setUserAnswer: (answer: string) => void;
}

const LongText: React.FC<IQuestion> = ({ question, index, setUserAnswer }) => {
  return (
    <div className="long-text-group">
      <label htmlFor="answer">
        {index}- {question}
      </label>
      <textarea
        name="answer"
        id="answer"
        placeholder="Answer..."
        onChange={(e) => setUserAnswer(e.currentTarget.value)}
      />
    </div>
  );
};

export default LongText;
