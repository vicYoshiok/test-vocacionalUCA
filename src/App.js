import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Registro from "./pages/Registro";
import TestVocacional from "./pages/TestVocacional";
import Resultado from "./pages/ResultadosTest";

function App() {
  // Estado global simple para el usuario y sus resultados
  const [userId, setUserId] = useState(null);
  const [resultado, setResultado] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registro setUserId={setUserId} />} />
        <Route path="/test" element={<TestVocacional userId={userId} setResultado={setResultado} />} />
        <Route path="/resultado" element={<Resultado resultado={resultado} />} />
      </Routes>
    </Router>
  );
}

export default App;
