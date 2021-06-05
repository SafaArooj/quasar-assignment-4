import { Dialog } from "quasar";

export function showErrorMessage(error){
    Dialog.create({
        title: 'Error',
        message: error
    })
}
