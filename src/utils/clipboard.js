import Swal from 'sweetalert2';

const clipboard = (id) => {
  // Obtener el elemento por su ID
  const element = document.getElementById(id);

  // Verificar si se encontró el elemento
  if (element) {
    // Copiar el contenido del elemento
    const copyContent = element.textContent;

    // Crear un elemento de textarea temporal para copiar el contenido al portapapeles
    const textareaTemp =
      document.createElement('textarea');
    textareaTemp.value = copyContent;

    // Agregar el textarea temporal al DOM
    document.body.appendChild(textareaTemp);

    // Seleccionar y copiar el contenido del textarea
    textareaTemp.select();
    document.execCommand('copy');

    // Eliminar el textarea temporal
    document.body.removeChild(textareaTemp);

    // Notificar al usuario que el contenido se ha copiado
    Swal.fire({
      toast: true,
      position: 'bottom-right',
      icon: 'success',
      text: 'Copied successfully!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } else {
    Swal.fire({
      toast: true,
      position: 'bottom-right',
      icon: 'error',
      text: 'Copy error',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};

export default clipboard;
