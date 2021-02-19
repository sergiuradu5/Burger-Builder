import { store } from 'react-notifications-component';

export const ToastNotification= (configNotification) => {
    store.addNotification(
        configNotification
    );
}
