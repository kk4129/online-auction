import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetails from './pages/AuctionDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyBids from './pages/MyBids';
import AboutUs from './pages/AboutUs'; // ✅ Import About Us Page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/about-us" element={<AboutUs />} /> {/* ✅ Add About Us Page */}
      </Routes>
    </Router>
  );
}

export default App;
