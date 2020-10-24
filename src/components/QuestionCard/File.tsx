import React, { useEffect, useState } from "react";

interface IQuestion {
  question: string;
  index: number;
  setUserAnswer: (answer: null | File) => void;
}

const File: React.FC<IQuestion> = ({ question, index, setUserAnswer }) => {
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    setFileName("");
  }, [index])

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.currentTarget.files && e.currentTarget.files[0];
    setFileName(file!.name);
    setUserAnswer(file);
  };

  return (
    <div className="file-group">
      <label dangerouslySetInnerHTML={{__html: `${index}- ${question}`}}></label>
      <div className="file-group__input">
        <input
          type="file"
          accept=".zip,.rar,.7zip"
          name="answer"
          id="answer"
          onChange={(e) => uploadFile(e)}
        />
        <label htmlFor="answer">Upload a file</label>
        <p>{fileName}</p>
      </div>
      <span>
        Allowed files are .zip files only. i.e. please zip your files before
        uploading them
      </span>
    </div>
  );
};

export default File;
