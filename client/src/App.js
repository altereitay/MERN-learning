import React, {Fragment} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import {Provider} from "react-redux";
import store from "./store";
import './App.css'

//<Route exact path='/login' element={<Login>/}/>

const App = () =>{
    return(
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Routes>
                        <Route exact path="/" element={<Landing/>} />
                    </Routes>
                    <section className="container">
                        <Routes>
                            <Route exact path='register' element={<Register/>}/>
                            <Route exact path='login' element={<Login/>}/>
                        </Routes>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
