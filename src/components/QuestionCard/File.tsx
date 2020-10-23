import React from "react";

interface IQuestion {
  question: string;
  index: number;
  setUserAnswer: (answer: string) => void;
}

const File: React.FC<IQuestion> = ({ question, index, setUserAnswer }) => {
  return (
    <div className="file-group">
      <label>
        {index}- {question}
      </label>
      <div className="file-group__input">
        <input
          type="file"
          accept=".zip,.rar,.7zip"
          name="answer"
          id="answer"
          onChange={(e) => setUserAnswer(e.currentTarget.value)}
        />
        <label htmlFor="answer">Upload a file</label>
      </div>
      <span>
        Allowed files are .zip files only. i.e. please zip your files before
        uploading them
      </span>
    </div>
  );
};

export default File;
