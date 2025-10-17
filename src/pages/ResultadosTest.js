import React from "react";

function ResultadosTest({ resultado }) {
  if (!resultado) {
    return <p>No hay resultados disponibles.</p>;
  }

  const handleDescargar = () => {
    //window.open(`https://tuservidor.com/api/resultado/${resultado.user_id}/pdf`, "_blank");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Resultado del Test</h2>
      <p><strong>Área sugerida:</strong> {resultado.area}</p>
      <p><strong>Descripción:</strong> {resultado.descripcion}</p>

      <button onClick={handleDescargar}>Descargar PDF</button>
    </div>
  );
}

export default ResultadosTest;
