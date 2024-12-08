import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainMenu, DemoCliente, DemoUsuario } from "./components";

function App() {
  return (
    <Router>
      <MainMenu />
      <Routes>
        <Route path="/demo-cliente" element={<DemoCliente />} />
        <Route path="/demo-usuario" element={<DemoUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;
