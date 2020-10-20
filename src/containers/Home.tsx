import React from "react";

const Home: React.FC = () => {
  return (
    <form className="Home">
      <div className="field-input">
        <label htmlFor="name">Your name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div className="field-input">
        <label htmlFor="email">Your email</label>
        <input type="email" name="email" id="email" />
      </div>
      <div className="field-input">
        <label>Technical circles</label>
        <span>You can choose one or two circles only</span>
        <div className="checkbox-input">
          <label htmlFor="front">
            <span></span>Front-end
          </label>
          <input type="checkbox" name="circle" id="front" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="back">
            <span></span>Back-end
          </label>
          <input type="checkbox" name="circle" id="back" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="data">
            <span></span>Data Science
          </label>
          <input type="checkbox" name="circle" id="data" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="security">
            <span></span>Security
          </label>
          <input type="checkbox" name="circle" id="security" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="front">
            <span></span>Front-end
          </label>
          <input type="checkbox" name="circle" id="front" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="graphic">
            <span></span>Graphic
          </label>
          <input type="checkbox" name="circle" id="graphic" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="android">
            <span></span>Android
          </label>
          <input type="checkbox" name="circle" id="android" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="ios">
            <span></span>IOS
          </label>
          <input type="checkbox" name="circle" id="ios" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="embedded">
            <span></span>Embedded Systems
          </label>
          <input type="checkbox" name="circle" id="embedded" />
        </div>
        <div className="checkbox-input">
          <label htmlFor="game">
            <span></span>Game development
          </label>
          <input type="checkbox" name="circle" id="game" />
        </div>
      </div>
    </form>
  );
};

export default Home;
