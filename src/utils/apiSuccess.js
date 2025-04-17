class ApiSuccess {
    constructor(data = {}, message, statuscode) {
        this.success = statuscode < 400;
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
    }
}
export default ApiSuccess;
