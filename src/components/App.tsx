import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Admin from '../containers/Quizzes';
import AdminAuth from '../containers/AdminAuth';
import Error from '../containers/Error';
import Home from '../containers/Home';
import Question from '../containers/Question';
import AddCircle from '../containers/AddCircle';
import AddQuiz from '../containers/AddQuiz';
import AddAdmin from '../containers/AddAdmin';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/question" component={Question} />
        <Route exact path="/auth" component={AdminAuth} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/add-circle" component={AddCircle} />
        <Route exact path="/add-quiz" component={AddQuiz} />
        <Route exact path="/add-admin" component={AddAdmin} />
        <Route exact path="/error" component={Error} />
        <Redirect to="/error" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
