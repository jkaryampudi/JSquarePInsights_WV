import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSection from './components/FilterSection';
import SuburbList from './components/SuburbList';
import SuburbProfile from './components/SuburbProfile';
import Footer from './components/Footer';
import { AuthProvider } from './auth/AuthContext';
import AuthPage from './auth/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <FilterSection />
                <div className="container">
                  <SuburbList />
                </div>
              </>
            } />
            <Route path="/suburb/:suburbId" element={
              <div className="container">
                <SuburbProfile />
              </div>
            } />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
