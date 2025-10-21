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
  R: {
    description: "Este tipo de personas son prácticas, activas y orientadas a la acción. Prefieren tareas físicas, técnicas o manuales donde puedan ver resultados concretos y resolver problemas de manera directa. Prefieres moverte, construir, reparar o experimentar, más que quedarte solo en la teoría. Te sientes cómodo en actividades donde puedes usar tus manos, herramientas o tecnología para crear o mejorar algo. Sueles tener buena coordinación, paciencia y gusto por los desafíos que implican precisión o trabajo técnico. Te atraen los entornos estructurados, claros y funcionales, o aquellos donde puedas estar al aire libre y mantenerte en movimiento.",
    careers: ["Veterinaria", "Ingeniería Civil", "Arquitectura", "Gastronomía y Negocios", "Ingeniería en Sistemas Computacionales"]
  },
  I: {
    description: "Este perfil se relaciona con personas curiosas, analíticas y observadoras. Te gusta entender el porqué de las cosas, descubrir cómo funcionan los procesos y buscar explicaciones más allá de lo evidente. No te conformas con respuestas superficiales; disfrutas pensar, analizar, experimentar y comprobar tus ideas. Tiendes a ser alguien reflexivo, paciente y detallista, que prefiere trabajar con información, datos o teorías antes que improvisar. Te motiva aprender constantemente, resolver problemas complejos y encontrar soluciones lógicas o científicas. Te gusta entender cómo funciona el cuerpo, cómo piensan las personas o cómo se puede mejorar algo con base en evidencia.",
    careers: ["Médico Cirujano", "Nutrición", "Psicología", "Kinesiología", "Ingeniería en Sistemas Computacionales", "Ingeniería para Diseño y Desarrollo de Software", "Odontología"]
  },
  A: {
    description: "Este perfil se relaciona con personas imaginativas, expresivas, sensibles y abiertas al cambio. Son creativas, disfrutan comunicar ideas, emociones o historias a través de distintos lenguajes visuales, sonoros o narrativos. Tienes gusto por el diseño, la moda, los medios digitales o cualquier actividad que permita innovar sin muchas restricciones. Te sientes cómodo en ambientes libres, flexibles y visualmente estimulantes, donde puedas ser tú mismo y no haya tantas reglas que limiten tu creatividad. Tienes facilidad para pensar fuera de lo común, conectar ideas diferentes y transformar lo cotidiano en algo único. Disfrutas crear proyectos propios y ver cómo tus ideas cobran vida.",
    careers: ["Diseño Gráfico y Medios Digitales", "Diseño e Imagen de la Moda", "Comunicación y Producción Audiovisual", "Mercadotecnia Digital", "Arquitectura"]
  },
  S: {
    description: "Personas con este perfil tienen una fuerte inclinación hacia el servicio, el acompañamiento y la mejora del entorno social. Eres alguien que escucha con atención, comprende las emociones de los demás y busca acompañar, enseñar o cuidar. Te resulta natural trabajar en equipo, colaborar y crear ambientes de confianza. Prefieres actividades donde puedan contribuir al crecimiento, la salud o la armonía de los demás. Te sientes realizado cuando puedes apoyar, orientar o motivar a otras personas, y tiendes a elegir actividades donde se promueva la salud, la educación o la justicia.",
    careers: ["Psicología", "Enfermería", "Kinesiología", "Derecho", "Médico Cirujano", "Odontología"]
  },
  E: {
    description: "Quienes se identifican con este perfil son dinámicos, extrovertidos, ambiciosos y con orientación a resultados. Te gusta tomar la iniciativa, liderar proyectos y proponer nuevas ideas. Tiendes a asumir responsabilidades con entusiasmo y disfrutas sentir que tus decisiones pueden generar impacto. Eres sociable, persuasivo y creativo, con facilidad para convencer, inspirar o motivar a los demás. Te interesa organizar, dirigir o emprender. Te motiva la posibilidad de superarte, alcanzar metas y crear algo propio. Te adaptas bien a la presión y ves los obstáculos como oportunidades para avanzar.",
    careers: ["Administración y Gestión Empresarial", "Comercio y Negocios Internacionales", "Mercadotecnia Digital", "Gastronomía y Administración de Negocios", "Derecho", "Comunicación"]
  },
  C: {
    description: "Este perfil agrupa a personas organizadas, detallistas, responsables y metódicas. Te gusta que las cosas estén en orden y disfrutas seguir procedimientos claros. Valoras la estabilidad, la seguridad y el saber exactamente qué se espera de ti. Eres detallista, metódico y cuidadoso en tu trabajo. Te sientes cómodo cuando puedes planear, registrar, clasificar o manejar información, y te molesta cuando las cosas se hacen sin estructura o sin claridad. Prefieres ambientes tranquilos y organizados, donde puedas aplicar tu sentido de responsabilidad y tu gusto por la exactitud.",
    careers: ["Contador Público", "Administración y Gestión Empresarial", "Comercio y Negocios Internacionales", "Derecho"]
  }
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

  const saveResults = async () => {
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
        credentials: "include"
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error al guardar los resultados");
    }

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

          {/* RESULTADO PRINCIPAL DESTACADO */}
          <div className="mb-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-success mb-2">
                <i className="bi bi-trophy-fill me-2"></i>
                Tu Perfil Vocacional Principal
              </h3>
              <p className="text-muted">Basado en tus respuestas, estas son tus áreas de mayor afinidad</p>
            </div>

            <div className="row g-4">
              {topAreas.map(([area, pct]) => (
                <div key={area} className="col-12">
                  <div 
                    className="card text-white p-4 shadow h-100 rounded-4 border-4 border-white"
                    style={{ 
                      backgroundColor: areas[area].color,
                      background: `linear-gradient(135deg, ${areas[area].color} 0%, ${areas[area].color}99 100%)`
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-md-3 text-center mb-3 mb-md-0">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                          style={{ 
                            width: "100px", 
                            height: "100px", 
                            backgroundColor: "rgba(255,255,255,0.2)",
                            border: "4px solid rgba(255,255,255,0.3)"
                          }}
                        >
                          <span className="fw-bold display-6">{pct}%</span>
                        </div>
                        <h4 className="fw-bold mt-2 mb-0">{areas[area].name}</h4>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="mb-3">
                          <h5 className="fw-bold mb-3">Descripción del Perfil</h5>
                          <p className="mb-0" style={{ lineHeight: "1.6" }}>
                            {areaDescriptions[area].description}
                          </p>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="bg-white text-dark p-3 rounded-3 h-100">
                          <h6 className="fw-bold text-center mb-3" style={{ color: areas[area].color }}>
                            <i className="bi bi-bookmark-star-fill me-2"></i>
                            Carreras Afines en nuestra oferta educativa
                          </h6>
                          <div className="d-flex flex-wrap gap-2 justify-content-center">
                            {areaDescriptions[area].careers.map((carrera, index) => (
                              <span 
                                key={index}
                                className="badge p-2 px-3 rounded-pill"
                                style={{ 
                                  backgroundColor: areas[area].color,
                                  color: "white",
                                  fontSize: "0.85rem"
                                }}
                              >
                                {carrera}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAS LAS ÁREAS EVALUADAS */}
          <div className="mb-4">
            <h4 className="fw-semibold mb-3 text-center">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Resultados Completos por Área
            </h4>
            
            <div className="row g-3">
              {sortedAreas.map(([area, score]) => {
                const maxScore = questions.flat().filter((q) => q.area === area).length * 4;
                const pct = percentages[area];
                const isTopArea = topAreas.some(([topArea]) => topArea === area);
                
                return (
                  <div key={area} className="col-lg-6">
                    <div 
                      className={`card h-100 shadow-sm border-0 ${isTopArea ? 'border-3 border-warning' : ''}`}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-3"
                              style={{ 
                                width: "20px", 
                                height: "20px", 
                                backgroundColor: areas[area].color 
                              }}
                            ></div>
                            <h5 className="card-title mb-0 fw-bold">{areas[area].name}</h5>
                            {isTopArea && (
                              <span className="badge bg-warning text-dark ms-2">
                                <i className="bi bi-star-fill me-1"></i>Principal
                              </span>
                            )}
                          </div>
                          <div className="text-end">
                            <div className="fw-bold fs-5" style={{ color: areas[area].color }}>
                              {pct}%
                            </div>
                            <small className="text-muted">{score}/{maxScore} puntos</small>
                          </div>
                        </div>
                        
                        <div className="progress mb-3" style={{ height: "20px", borderRadius: "10px" }}>
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

                        <div className="mt-3">
                          <h6 className="fw-semibold mb-2">
                            <i className="bi bi-briefcase me-2"></i>
                            Carreras Relacionadas que ofrecemos:
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {areaDescriptions[area].careers.slice(0, 3).map((carrera, index) => (
                              <span 
                                key={index}
                                className="badge p-1 px-2 rounded"
                                style={{ 
                                  backgroundColor: areas[area].color + "20",
                                  color: areas[area].color,
                                  border: `1px solid ${areas[area].color}`,
                                  fontSize: "0.75rem"
                                }}
                              >
                                {carrera}
                              </span>
                            ))}
                            {areaDescriptions[area].careers.length > 3 && (
                              <span className="badge bg-light text-muted">
                                +{areaDescriptions[area].careers.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECOMENDACIONES FINALES */}
          <div className="card bg-primary  mt-4">
            <div className="card-body text-center">
              <h4 className="fw-bold mb-3">
                <i className="bi bi-lightbulb-fill me-2"></i>
                Próximos Pasos Recomendados
              </h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-3 h-100">
                    <i className="bi bi-search-heart display-6 mb-2"></i>
                    <h6>Investiga Carreras</h6>
                    <small>Profundiza en las carreras que más te llamaron la atención</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-3 h-100">
                    <i className="bi bi-people display-6 mb-2"></i>
                    <h6>Habla con Profesionales</h6>
                    <small>Conecta con personas que ejerzan las profesiones de tu interés</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-3 h-100">
                    <i className="bi bi-journal-check display-6 mb-2"></i>
                    <h6>Planifica tu Futuro</h6>
                    <small>Establece metas y pasos concretos para alcanzar tus objetivos</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="text-center mt-5">
            <button className="btn btn-outline-secondary me-3 px-4 py-2 rounded-3" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-repeat me-2"></i>Realizar nuevamente
            </button>
            <button className="btn btn-success px-4 py-2 rounded-3" onClick={saveResults}>
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