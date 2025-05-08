class ApiSuccess {
    constructor(statusCode = 200, message = "Success", data = {}, meta = {}) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }

    //200 ok
    static ok(data = {}, message = "Ok", meta = {}) {
        return new ApiSuccess(200, message, data, meta)
    }

    //201 created 
    static created(data = {}, message = "Resource created", meta={}) {
        return new ApiSuccess(201,message,data,meta)
    }

    
}
export default ApiSuccess;
