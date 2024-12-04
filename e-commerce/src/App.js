// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import UserChoices from './pages/userChoices';
import Login from './pages/login';
import SignUp from './pages/signUp';
import BookPass from './pages/bookPass'
import ForgotPass from './pages/forgotPass'
import AccInfo from './pages/acc-info'
import Admin from './admin/BPRegistration'
import Bucket from './pages/viewBucket'
import Crud from './pages/adminPanel';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path='/' element={<UserChoices />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='/bookPass' element={<BookPass />} />
                    <Route path='/forgotPass' element={<ForgotPass/>} />
                    <Route path='/acc-info' element={<AccInfo/>} />
                    <Route path='/admin/BPRegistration' element={<Admin/>} />
                    <Route path='/viewBucket' element={<Bucket/>} />
                    <Route path='/adminPanel' element={<Crud />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
