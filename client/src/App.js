import React, {Fragment, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import {Provider} from "react-redux";
import store from "./store";
import Alert from "./components/layout/Alert";
import './App.css'
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";


if(localStorage.token){
    setAuthToken(localStorage.token);
}

const App = () =>{
    useEffect(()=>{
       store.dispatch(loadUser());
    }, []);
    return(
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Routes>
                        <Route exact path="/" element={<Landing/>} />
                    </Routes>
                    <section className="container">
                        <Alert/>
                        <Routes>
                            <Route exact path='/register' element={<Register/>}/>
                            <Route exact path='/login' element={<Login/>}/>
                            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />}/>
                            <Route path='/create-profile' element={<PrivateRoute component={CreateProfile} />}/>
                            <Route path='/edit-profile' element={<PrivateRoute component={EditProfile} />}/>
                            <Route path='/add-experience' element={<PrivateRoute component={AddExperience} />}/>
                            <Route path='/add-education' element={<PrivateRoute component={AddEducation} />}/>
                        </Routes>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
