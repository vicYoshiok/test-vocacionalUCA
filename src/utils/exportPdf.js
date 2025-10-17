// utils/exportPdf.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exporta la vista HTML de resultados del test vocacional a PDF
 * @param {Object} options - Opciones para la exportación
 */
export const exportResultsToPdf = async (options = {}) => {
  try {
    const {
      elementSelector = '.card.shadow-lg.p-4.rounded-4.border-0',
      fileName = null,
      scale = 2,
      quality = 1.0
    } = options;

    // Encontrar el elemento que contiene los resultados
    const resultsElement = document.querySelector(elementSelector);
    
    if (!resultsElement) {
      alert('No se encontraron resultados para exportar');
      return;
    }

    // Obtener datos del usuario para el nombre del archivo
    const usuario = JSON.parse(localStorage.getItem("datosUsuario") || "{}");
    const finalFileName = fileName || `resultados-test-${usuario?.nombre || "usuario"}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Ocultar temporalmente botones de acción si es necesario
    const actionButtons = resultsElement.querySelector('.text-center.mt-5');
    let originalDisplay = '';
    if (actionButtons) {
      originalDisplay = actionButtons.style.display;
      actionButtons.style.display = 'none';
    }

    // Crear canvas desde el HTML
    const canvas = await html2canvas(resultsElement, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      quality: quality
    });

    // Restaurar botones de acción
    if (actionButtons) {
      actionButtons.style.display = originalDisplay;
    }

    // Convertir canvas a imagen
    const imgData = canvas.toDataURL('image/jpeg', quality);
    
    // Calcular dimensiones del PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Agregar imagen al PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    // Descargar PDF
    pdf.save(finalFileName);

  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el PDF. Por favor, intente nuevamente.');
  }
};