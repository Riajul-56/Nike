class ApiError extends Error {
    // construstor(statuscode, message, erros) {
    //     super(message);
    //     this.success = false;
    //     this.statuscode = statuscode;
    //     this.message = message ?? "Something want wrong";
    //     this.erros = erros ?? {};
    //     this.stack = Error.captureStackTrace(this, this.construstor);

    // }

    //  @param {number} statuscode -the HTTP status code for the error 
    //  @param {string} message  -the error message 
    //  @param {object} erros -additional error details (optional)


    constructor(statuscode, message = "Somthing went wrong ", erros = {}, stack = " ", arrocode = '') {
        super(message);
        this.name=this.constructor.name;
        this.success=false;
        this.statuscode=statuscode;
        
    }


}
export default ApiError;