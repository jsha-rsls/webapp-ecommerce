// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import LandingShop from './pages/landingshop';
import Login from './pages/login';
import SignUp from './pages/signUp';
import BookPass from './pages/bookPass'
import ForgotPass from './pages/forgotPass'
import AccInfo from './pages/acc-info'
import Admin from './admin/BPRegistration'
const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path='/' element={<LandingShop />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='/bookPass' element={<BookPass />} />
                    <Route path='/forgotPass' element={<ForgotPass/>} />
                    <Route path='/acc-info' element={<AccInfo/>} />
                    <Route path='/admin/BPRegistration' element={<Admin/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
