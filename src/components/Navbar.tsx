import React from "react";

const Navbar: React.FC<{ logoOnly?: boolean }> = ({ logoOnly }) => {
  return (
    <nav className="Navbar">
      <h1>CAT Race 1.0.0</h1>
      {!logoOnly && (
        <React.Fragment>
          <p>
            Hello to CAT Race 1.0.0 hope you all the luck and we all always with
            you
          </p>
          <p className="Navbar__logo">Once a CATian, always a CATian</p>
        </React.Fragment>
      )}
    </nav>
  );
};

export default Navbar;
