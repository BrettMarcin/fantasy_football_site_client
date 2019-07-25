import React from 'react';
import About from './components/About/About';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import CreateDraft from './components/CreateDraft/CreateDraft';
import Draft from './components/Draft/Draft';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component{

  render() {
      return(
      <Router>
        <div>
          <NavBar />
          <hr/>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/createDraft" component={CreateDraft}/>
          <Route path="/Draft/:id" component={Draft}/>
        </div>
      </Router>
    );
  }
}

export default App;
