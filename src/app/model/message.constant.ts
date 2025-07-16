import { FuseConfirmationConfig } from "@fuse/services/confirmation";

export const SaveMessage: FuseConfirmationConfig = {
    title: '',
    message: 'Are you sure you want to save?',
    icon: {
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
    },
    actions: {
        confirm: {
            show: true,
            label: "Yes",
            color: 'primary',
        },
        cancel: {
            show: true,
            label: 'Cancel',
        },
    },
    dismissible: true
};

export const SuccessMessage: FuseConfirmationConfig = {
    title      : 'Successful!',
    message    : 'Transaction has been Saved!',
    icon       : {
        show : true,
        name : 'heroicons_outline:clipboard-check',
        color: 'success'
    },
    actions    : {
        confirm: {
            show : true,
            label: 'Confirm',
            color: 'primary'
        },
        cancel : {
            show : false,
            label: 'Cancel'
        }
    },
    dismissible: false
};

export const FailedMessage: FuseConfirmationConfig = {
    title      : 'Failed!',
    message    : 'Transaction Failed!',
    icon       : {
        show : true,
        name : 'heroicons_outline:exclamation-circle',
        color: 'error'
    },
    actions    : {
        confirm: {
            show : true,
            label: 'Confirm',
            color: 'warn'
        },
        cancel : {
            show : false,
            label: 'Cancel'
        }
    },
    dismissible: false
};


export const RequiredFields: FuseConfirmationConfig = {
    title      : 'Warning!',
    message    : 'Please fill the required field',
    icon       : {
        show : true,
        name : 'heroicons_outline:exclamation-circle',
        color: 'error'
    },
    actions    : {
        confirm: {
            show : true,
            label: 'Ok',
            color: 'warn'
        },
        cancel : {
            show : false,
            label: 'Cancel'
        }
    },
    dismissible: false
};

export const GenerationMsg: FuseConfirmationConfig = {
    title      : 'Generating',
    message    : 'Please wait a moment!',
    icon       : {
        show : true,
        name : 'heroicons_outline:exclamation-circle',
        color: 'error'
    },
    actions    : {
        confirm: {
            show : false,
            label: 'Ok',
            color: 'warn'
        },
        cancel : {
            show : false,
            label: 'Cancel'
        }
    },
    dismissible: false
};
