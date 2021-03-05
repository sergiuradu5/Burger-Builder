
import { store } from 'react-notifications-component';

export const ToastNotification= (configNotification) => {

  let intFrameWidth = window.innerWidth;
  let isMobile = false;
  if (intFrameWidth < 500) {
    isMobile= true;
  }

    store.addNotification({
        ...configNotification,
        insert: "top",
        container: isMobile ? "bottom-center" : "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true
        }
    });
}
