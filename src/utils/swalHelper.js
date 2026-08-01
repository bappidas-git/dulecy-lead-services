/**
 * SweetAlert2 wrapper that ensures popups render ABOVE all overlays (drawers, modals)
 * Use this instead of Swal.fire() throughout the app
 *
 * SweetAlert2 (~30 KB gzipped, CSS included) is loaded on first use rather
 * than imported statically (Prompt 12). Every popup here is raised from a
 * user action — a failed submit, a duplicate-enquiry notice — so the chunk
 * downloads while the user is still reading the page, and never at all for
 * the majority who simply browse. The helpers already returned promises, so
 * the public API is unchanged.
 */
let swalPromise;
const getSwal = () => {
  if (!swalPromise) {
    swalPromise = import(
      /* webpackChunkName: "sweetalert" */ 'sweetalert2'
    ).then((m) => m.default);
  }
  return swalPromise;
};

const swalConfig = {
  backdrop: 'rgba(0,0,0,0.7)',
  customClass: {
    container: 'swal-above-drawer',
    popup: 'swal-above-drawer-popup',
  },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '100000';
  },
};

export const showAlert = async (options) => {
  const Swal = await getSwal();
  return Swal.fire({
    ...swalConfig,
    ...options,
  });
};

export const showSuccess = (title, text) => {
  return showAlert({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#0B0B0C',
    confirmButtonText: 'Great!',
  });
};

export const showError = (title, text) => {
  return showAlert({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#0B0B0C',
  });
};

export const showInfo = (title, text) => {
  return showAlert({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#0B0B0C',
  });
};

export default showAlert;
