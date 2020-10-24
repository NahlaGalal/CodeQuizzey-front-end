import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Error from '../containers/Error';
import Home from '../containers/Home';
import Question from '../containers/Question';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/question" component={Question} />
        <Route exact path="/error" component={Error} />
        <Redirect to="/error" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
