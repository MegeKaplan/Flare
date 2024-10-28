import { Bounce } from "react-toastify";

const toastifyConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const toastifyContainerConfig = {
  ...toastifyConfig,
};

export const toastifyEmitterConfig = {
  ...toastifyConfig,
};
