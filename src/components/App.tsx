import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from '../containers/Home';
import Question from '../containers/Question';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/question" component={Question} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
