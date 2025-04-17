class ApiError extends Error {
    construstor(statuscode, message, erros) {
        super(message);
        this.success = false;
        this.statuscode = statuscode;
        this.message = message ?? "Something want wrong";
        this.erros = erros ?? {};
        this.stack = Error.captureStackTrace(this, this.construstor);

    }
}
export default ApiError;