import Swal from 'sweetalert2';

const appError = (err) => {
  console.error(err);

  if (
    err.response.data.message === 'jwt expired'
  ) {
    sessionStorage.removeItem('authToken');

    return Swal.fire({
      title: 'Session expired',
      text: 'Please login again',
      icon: 'warning',
    }).then(() => {
      window.location = '/#/login';
    });
  }
};

export default appError;
