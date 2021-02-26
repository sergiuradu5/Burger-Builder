import { store } from 'react-notifications-component';

export const ToastNotification= (configNotification) => {
    store.addNotification({
        ...configNotification,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });
}
