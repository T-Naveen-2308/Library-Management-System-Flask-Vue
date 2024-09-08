import { useToast } from "vue-toastification";

const toast = useToast();

function notify(message, type = "info") {
    switch (type) {
        case "success": {
            toast.success(message);
            break;
        }
        case "error": {
            toast.error(message);
            break;
        }
        case "info": {
            toast.info(message);
            break;
        }
        case "warning": {
            toast.warning(message);
            break;
        }
        default: {
            toast(message);
        }
    }
}

function integerChecker(param) {
    return (to, from, next) => {
        const isValidId = Number.isInteger(Number(to.params[param]));
        if (isValidId) {
            next();
        } else {
            next(false);
        }
    };
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

export { integerChecker, formatDate, notify };
