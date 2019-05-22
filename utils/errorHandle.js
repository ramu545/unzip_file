function getMessage() {
    const successMessages = {
        "SUCCESS": {
            data: { message: "alter success", type: "success", data: {} },
            status: 200
        },
        "SERVER_CREATED": {
            data: { message: "server started", type: "success", data: {} },
            status: 200
        }
    }

    const errorMessages = {
        "NOT_FOUND": {
            data: { message: "no image found to alter", type: "error" },
            status: 400
        },
        "SERVER_CREATION_ERROR": {
            data: { message: "Server failed to start.", type: "error" },
            status: 500
        },
        "ALTER_FAILED": {
            data: { message: "alter failed, please try again", type: "error" },
            status: 400
        },
        "UNKNOWN": {
            data: { message: "something went wrongs, please try after sometime", type: "error" },
            status: 400
        }
    }

    function error(key) {
        if (errorMessages.hasOwnProperty(key)) {
            return errorMessages[key];
        } else {
            return errorMessages["UNKNOWN"];
        }
    }

    function success(key, extraText = "", data = {}) {
        let msg;
        if (successMessages.hasOwnProperty(key)) {
            msg = successMessages[key].data.message + extraText;
        } else {
            msg = successMessages["UNKNOWN"].data.message + extraText;
        }
        let obj = Object.assign({}, successMessages[key]);
        obj.data.data = data;
        obj.data.message = msg;
        return obj;
    }
    return {
        error,
        success
    }
}

module.exports = getMessage();
