import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Registro from "./pages/Registro";
import TestVocacional from "./pages/TestVocacional";
import Resultado from "./pages/ResultadosTest";

function App() {
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