import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from "./pages/Home/Home";
import Teste from "./pages/Teste/Teste";
function App() {
  return (
    <BrowserRouter>
      <div id="root">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/teste" element={<Teste />} />
        
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
