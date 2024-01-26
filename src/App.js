import React from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Mercedes from "./pages/Mercedes";
import Bmw from "./pages/Bmw";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Toaster />
        </div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mercedes" element={<Mercedes />} />
          <Route path="/bmw" element={<Bmw />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
