import './App.css';
import Navbar from './Navbar/Navbar';
import Home from './Home/Home';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContentProfile from './ContentProfile/ContentProfile';
import 'bootstrap/dist/css/bootstrap.css';
import About from './About/About';
import Contactus from './ContactUs/Contactus';


function App() {
  const firebaseApp = firebase.apps[0];
  return (
    <Router>
    <div className="App">
      <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/content/:country/:id" component={ContentProfile}/>
            <Route path="/about">
              <About/>
            </Route>
            <Route path="/contact">
              <Contactus/>
            </Route>
          </Switch>
        </div>
    </div>
    </Router>
  );
}

export default App;
