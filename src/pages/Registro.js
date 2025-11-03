import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import headerImg from "../assets/testOrientacionVocacional.jpg";
function Registro({ setUserId }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    edad: "",
    escuela: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const portalId = "21155268";
    const formId = "8e1022c7-6363-4c17-a413-900e113e96c4";
    const payload = {
      fields: [
        { name: "firstname", value: form.nombre },
        { name: "lastname", value: form.lastname },
        { name: "email", value: form.correo },
        { name: "phone", value: form.telefono },
        { name: "edad", value: form.edad },
        {
          name: "universidad_o_escuela_de_procedencia",
          value: form.escuela,
        },
      ],
      context: {
        pageUri: window.location.href,
        pageName: "Registro Test Vocacional",
      },
    };

    // Guardar datos del usuario localmente
    localStorage.setItem("datosUsuario", JSON.stringify(form));

    // envio a hubspot
    
    await axios.post(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      payload
    );
    
    // manejo de registro exitoso 
    alert("¡Registro exitoso!");
    navigate("/test");
  } catch (error) {
    //manejo de registro fallido
    console.error("Error al registrar en HubSpot:", error);
    alert("Hubo un error al registrar tus datos.");
  }
};


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Imagen superior */}
            <div className="w-100">
              <img
                src={headerImg}
                alt="Header"
                className="img-fluid w-100"
                style={{ height: "180px", objectFit: "cover" }}
              />
            </div>

            <div className="card-body p-4">
              <h1 className="text-center mb-4" style={{color:'#24418b' }}>
                Test Vocacional
              </h1>
              <p className="text-center">
                Esta prueba vocacional ayudará a conocer tu perfil profesional.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      placeholder="Tu nombre"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastname" className="form-label">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastname"
                      placeholder="Tus apellidos"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      name="correo"
                      placeholder="ejemplo@correo.com"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="edad" className="form-label">
                      Edad
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="edad"
                      name="edad"
                      placeholder="Edad (mayor a 10 años)"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="escuela" className="form-label">
                      Escuela de procedencia
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="escuela"
                      name="escuela"
                      placeholder="Nombre de tu escuela"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid mt-4" >
                  <button type="submit" className="btn btn-primary" style={{background:'#24418b' }}>
                    Comenzar Test
                  </button>
                </div>
              </form>

              {/* Aviso de privacidad */}
              <div className="mt-4">
                <small className="text-muted">
                  Con fundamento en los artículos 15 y 16 de la Ley Federal de
                  Protección de Datos Personales en Posesión de Particulares,
                  hacemos de su conocimiento que la Universidad Cuauhtémoc,
                  Plantel Aguascalientes, S.C., con domicilio en Adolfo López
                  Mateos No. 102 El Llano, Jesús María, Ags. México C.P.: 20908,
                  es responsable de recabar sus datos personales, del uso que se
                  les dé y de su protección. Para más información consulta{" "}
                  <a
                    href="https://ucuauhtemoc.edu.mx/aviso-privacidad"
                    target="_blank"
                    rel="noreferrer"
                  >
                    nuestro aviso de privacidad
                  </a>
                  .
                </small>
                <br></br>
                
              </div>
              
            </div>

            
          </div>
          <p className=" text-center text-muted py-3"> <small>Universidad Cuauhtémoc Aguascalientes - 2025</small></p>
        </div>
      </div>
    </div>
  );
}

export default Registro;



   /*
<div class="d-flex flex-column h-100 sombra overflow-hidden">
<div class="p-md-3 p-2">
<p class="azul4 mb-2"><strong>titulo</strong></p>
<p class="mb-1"><strong class="azul4">Palabras clave: </strong></p>
<p class="mb-2"><strong class="azul4">Autor:</strong><sup>1</sup></p>
<p class="mb-2"><sup>1</sup>descripcion</p>
</div>
<a class="d-block mt-auto py-2 px-3 blanco fw-semibold fs16 text-decoration-underline text-end" href="#link" 
target="_blank" rel="noopener" style="background-color: #14438d;" 
data-hs-domain-rewrite="true"> Descargar &gt; </a></div>*/


/**
 * codigo de insercción de hubspot, ocupamos solo los campos de portalid, na y formid ya que nuestro formulario es personalizado
 * <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "21155268",
    formId: "8e1022c7-6363-4c17-a413-900e113e96c4",
    region: "na1"
  });
</script>*/
