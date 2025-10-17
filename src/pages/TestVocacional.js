import React, { useState, useEffect } from "react";
import { questions } from "../components/data";
import { exportResultsToPdf } from "../utils/exportPdf";

const areas = {
  R: { name: "Realista", color: "#E74C3C" },
  I: { name: "Investigador", color: "#3498DB" },
  A: { name: "Artístico", color: "#9B59B6" },
  S: { name: "Social", color: "#2ECC71" },
  E: { name: "Emprendedor", color: "#F39C12" },
  C: { name: "Convencional", color: "#1ABC9C" },
};

const areaDescriptions = {
  R: "Personas prácticas, activas y enfocadas en el hacer. Prefieren tareas físicas, técnicas o manuales.",
  I: "Personas analíticas, lógicas y observadoras. Disfrutan investigar y resolver problemas complejos.",
  A: "Personas imaginativas, creativas y expresivas. Disfrutan comunicar ideas y emociones.",
  S: "Personas empáticas, pacientes y solidarias. Disfrutan ayudar y trabajar en equipo.",
  E: "Personas dinámicas, extrovertidas y con orientación a resultados. Disfrutan liderar y tomar decisiones.",
  C: "Personas organizadas, detallistas y metódicas. Prefieren estructuras claras y procesos ordenados.",
};

const TestVocacional = () => {
  const [usuario, setUsuario] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Carga datos del usuario desde localStorage
  useEffect(() => {
    const datos = localStorage.getItem("datosUsuario");
    if (datos) setUsuario(JSON.parse(datos));
  }, []);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: parseInt(value) }));
  };

  const nextPage = () => {
    const currentQuestions = questions[currentPage];
    const unanswered = currentQuestions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert("Debes responder todas las preguntas de esta sección antes de continuar.");
      return;
    }
    if (currentPage < questions.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.flat().forEach((q) => {
      if (answers[q.id]) scores[q.area] += answers[q.id];
    });
    return scores;
  };

  const handleSubmit = () => {
    const totalQuestions = questions.flat().length;
    if (Object.keys(answers).length < totalQuestions) {
      if (!window.confirm("No has respondido todas las preguntas. ¿Deseas continuar?")) return;
    }
    setShowResults(true);
  };

  // Reemplaza la función saveResults
  const saveResults = async () => {
    const results = calculateResults();

    // Calculamos porcentajes igual que antes
    const maxPointsPerArea = {};
    Object.keys(areas).forEach((area) => {
      const questionsInArea = questions.flat().filter((q) => q.area === area).length;
      maxPointsPerArea[area] = questionsInArea * 4;
    });

    const percentages = Object.fromEntries(
      Object.entries(results).map(([area, score]) => [
        area,
        Math.round((score / maxPointsPerArea[area]) * 100),
      ])
    );
     const payload = {
    usuario,
    resultados: results,
    porcentajes: percentages,
    respuestas: answers
  };
    try {
    const response = await fetch("http://localhost:8000/api/guardar-resultado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "include" // <--- si quieres enviar cookies o autenticación
    });
    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error(error);
    alert("Error al guardar los resultados");
  }

    

    // Llamamos a la función externa para generar PDF
   /* exportResultsToPdf({
      usuario,
      results,
      percentages,
      questions,
      areas,
      areaDescriptions,
      logoUrl: "../logo.png",
    });*/
     exportResultsToPdf();
  };

  if (showResults) {
    const results = calculateResults();

    const maxPointsPerArea = {};
    Object.keys(areas).forEach((area) => {
      const questionsInArea = questions.flat().filter((q) => q.area === area).length;
      maxPointsPerArea[area] = questionsInArea * 4;
    });

    const percentages = Object.fromEntries(
      Object.entries(results).map(([area, score]) => [
        area,
        Math.round((score / maxPointsPerArea[area]) * 100),
      ])
    );

    const maxPercentage = Math.max(...Object.values(percentages));
    const topAreas = Object.entries(percentages).filter(([_, pct]) => pct === maxPercentage);
    const sortedAreas = Object.entries(results).sort((a, b) => b[1] - a[1]);
    
    return (
      <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="card shadow-lg p-4 rounded-4 border-0" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-center mb-4">
            <img 
              src="https://www.ucuauhtemoc.edu.mx/hubfs/sitio/generales/universidad-cuauhtemoc-campus-aguascalientes-header-logo.svg" 
              alt="Logo Universidad Cuauhtémoc"
              className="img-fluid mb-3"
              style={{ maxHeight: "70px" }}
            />
            <h2 className="fw-bold text-primary mb-2">Resultados de tu Test Vocacional</h2>
            <p className="text-muted">Descubre tus áreas de mayor afinidad profesional</p>
          </div>

          {/* Datos del usuario */}
          {usuario ? (
            <div className="card mb-4 shadow-sm border-0 p-4 bg-light rounded-3">
              <h3 className="text-primary fw-bold mb-3">¡Hola {usuario.nombre} {usuario.lastname}!</h3>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><i className="bi bi-envelope me-2"></i><strong>Correo:</strong> {usuario.correo}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><i className="bi bi-phone me-2"></i><strong>Teléfono:</strong> {usuario.telefono}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><i className="bi bi-calendar me-2"></i><strong>Edad:</strong> {usuario.edad}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1"><i className="bi bi-building me-2"></i><strong>Escuela/Universidad:</strong> {usuario.escuela}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">Cargando datos del usuario...</p>
          )}

          {/* Tarjetas top */}
          <div className="mb-5">
            <h4 className="fw-semibold mb-3 text-center">Tus áreas de mayor afinidad</h4>
            <div className="row g-3">
              {topAreas.map(([area, pct]) => (
                <div key={area} className="col-md-6">
                  <div 
                    className="card text-white p-4 shadow h-100 rounded-3"
                    style={{ backgroundColor: areas[area].color }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <span className="fw-bold">{pct}%</span>
                      </div>
                      <h5 className="fw-bold mb-0">{areas[area].name}</h5>
                    </div>
                    <p className="mb-0">{areaDescriptions[area]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de puntuaciones */}
          <div className="mb-4">
            <h4 className="fw-semibold mb-3">Puntuaciones por área</h4>
            <p className="text-muted mb-3">
              <em>La puntuación indica puntos obtenidos sobre el máximo posible en cada área.</em>
            </p>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm rounded overflow-hidden">
                <thead className="table-primary">
                  <tr>
                    <th>Área</th>
                    <th>Puntuación</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAreas.map(([area, score]) => {
                    const maxScore = questions.flat().filter((q) => q.area === area).length * 4;
                    const pct = percentages[area];
                    return (
                      <tr key={area}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-2"
                              style={{ width: "12px", height: "12px", backgroundColor: areas[area].color }}
                            ></div>
                            {areas[area].name}
                          </div>
                        </td>
                        <td className="fw-semibold">{score} / {maxScore}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: "20px", borderRadius: "10px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: areas[area].color,
                                  fontWeight: "bold",
                                  transition: "width 1s ease-in-out"
                                }}
                              >
                                {pct}%
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="text-center mt-5">
            <button className="btn btn-outline-secondary me-3 px-4 py-2 rounded-3" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-repeat me-2"></i>Realizar nuevamente
            </button>
            <button className="btn btn-primary px-4 py-2 rounded-3" onClick={saveResults}>
              <i className="bi bi-download me-2"></i>Guardar resultados
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Sección del Test ---
  const currentQuestions = questions[currentPage];
  const totalQuestions = questions.flat().length;
  const answeredQuestions = Object.keys(answers).length;
  const completionPercent = Math.round((answeredQuestions / totalQuestions) * 100);

  // Función para obtener el color según el valor
  const getToggleColor = (value, isActive) => {
    if (!isActive) return "btn-outline-secondary";
    
    switch(value) {
      case 1:
      case 2:
        return "btn-danger";
      case 3:
        return "btn-warning";
      case 4:
        return "btn-success";
      default:
        return "btn-outline-secondary";
    }
  };

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg, #1c2936 0%, #74b0ff 100%)",
      padding: "2rem 0"
    }}>
      <div className="container">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Header con gradiente */}
          <div className="card-header py-4 border-0" style={{
            background: "linear-gradient(45deg, #1c2936, #74b0ff)"
          }}>
            <div className="text-center text-white">
              <img
                src="https://www.ucuauhtemoc.edu.mx/hubfs/sitio/generales/universidad-cuauhtemoc-campus-aguascalientes-header-logo.svg"
                alt="Logo Universidad Cuauhtémoc"
                className="img-fluid mb-3 bg-white p-2 rounded-3"
                style={{ maxHeight: "60px" }}
              />
              <h1 className="fw-bold mb-2">Test Vocacional</h1>
              <p className="mb-0 opacity-75">
                <strong>Instrucciones:</strong> Selecciona un número del 1 al 4 según tu afinidad con cada afirmación.
              </p>
            </div>
          </div>

          <div className="card-body p-4" style={{ backgroundColor: "#f8f9fa" }}>
            {/* Información del usuario */}
            {usuario ? (
              <div className="card mb-4 shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h3 className="text-primary fw-bold mb-3 text-center">
                    <i className="bi bi-person-circle me-2"></i>¡Hola {usuario.nombre} {usuario.lastname}!
                  </h3>
                  <div className="row text-center">
                    <div className="col-md-6 col-lg-3 mb-2">
                      <p className="mb-1">
                        <i className="bi bi-envelope text-primary me-2"></i>
                        <strong>Correo:</strong> {usuario.correo}
                      </p>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-2">
                      <p className="mb-1">
                        <i className="bi bi-phone text-primary me-2"></i>
                        <strong>Teléfono:</strong> {usuario.telefono}
                      </p>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-2">
                      <p className="mb-1">
                        <i className="bi bi-calendar text-primary me-2"></i>
                        <strong>Edad:</strong> {usuario.edad}
                      </p>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-2">
                      <p className="mb-1">
                        <i className="bi bi-building text-primary me-2"></i>
                        <strong>Escuela:</strong> {usuario.escuela}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-2">Cargando datos del usuario...</p>
              </div>
            )}

            {/* Barra de progreso */}
            <div className="card mb-4 shadow-sm border-0 rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-graph-up me-2"></i>Progreso del test
                  </span>
                  <span className="fw-bold text-primary">{completionPercent}% completado</span>
                </div>
                <div className="progress" style={{ height: "12px", borderRadius: "10px" }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ 
                      width: `${completionPercent}%`, 
                      borderRadius: "10px",
                      background: "linear-gradient(45deg, #3498db, #2ecc71)"
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">Página {currentPage + 1} de {questions.length}</small>
                  <small className="text-muted">{answeredQuestions} de {totalQuestions} preguntas</small>
                </div>
              </div>
            </div>

            {/* Formulario de preguntas */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body p-0">
                {currentQuestions.map((q, index) => (
                  <div key={q.id} className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-light'}`}>
                    <div className="question-card">
                      <label className="form-label fw-semibold text-dark mb-3 fs-5">
                        <span className="badge bg-primary me-2">{q.id}</span>
                        {q.text}
                      </label>
                      
                      <div className="rating-scale mt-4 mx-2">
                        <div className="d-flex justify-content-center align-items-center gap-3 px-3">
                          {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="rating-option text-center flex-fill">
                              <input
                                className="btn-check"
                                type="radio"
                                name={`q${q.id}`}
                                value={num}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                checked={answers[q.id] === num}
                                id={`q${q.id}_${num}`}
                              />
                              <label 
                                className={`btn rating-label ${getToggleColor(num, answers[q.id] === num)}`}
                                htmlFor={`q${q.id}_${num}`}
                                style={{
                                  minWidth: "70px",
                                  padding: "0.6rem 0.4rem",
                                  borderWidth: "2px",
                                  transition: "all 0.2s ease",
                                  width: "100%"
                                }}
                              >
                                <div className="rating-number fw-bold fs-6">{num}</div>
                                <small className="rating-text d-block">
                                  {num === 1 ? "Nada" : 
                                   num === 2 ? "Poco" : 
                                   num === 3 ? "Medio" : "Mucho"}
                                </small>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-secondary px-4 py-2 rounded-3 d-flex align-items-center"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <i className="bi bi-chevron-left me-2"></i>Anterior
              </button>
              
              <div className="text-center">
                <small className="text-muted d-block">
                  Página {currentPage + 1} de {questions.length}
                </small>
                <div className="progress" style={{ width: "100px", height: "4px" }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ 
                      width: `${((currentPage + 1) / questions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <button
                className={`btn px-4 py-2 rounded-3 fw-semibold d-flex align-items-center ${
                  currentPage === questions.length - 1 ? "btn-success" : "btn-primary"
                }`}
                onClick={currentPage === questions.length - 1 ? handleSubmit : nextPage}
              >
                {currentPage === questions.length - 1 ? (
                  <>
                    <i className="bi bi-check-circle me-2"></i>Ver resultados
                  </>
                ) : (
                  <>
                    Siguiente <i className="bi bi-chevron-right ms-2"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .rating-label {
          transition: all 0.2s ease;
        }
        
        .rating-label:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .btn-check:checked + .rating-label {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .question-card {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default TestVocacional;

/**
 * 
 * User::create([
    'name' => 'Administrador',
    'email' => 'desarrollo.mkt@ucuauhtemoc.edu.mx',
    'password' => bcrypt('12345678'),
]);
 */