import React from "react";

interface IQuestion {
  question: string;
  index: number;
  setUserAnswer: (answer: string | File) => void;
}

const File: React.FC<IQuestion> = ({ question, index, setUserAnswer }) => {
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.currentTarget.files ? e.currentTarget.files[0] : "";
    setUserAnswer(file);
  };

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
          onChange={(e) => uploadFile(e)}
        />
        <label htmlFor="answer">Upload a file</label>
        {/* <p>{fileName}</p> */}
      </div>
      <span>
        Allowed files are .zip files only. i.e. please zip your files before
        uploading them
      </span>
    </div>
  );
};

export default File;
