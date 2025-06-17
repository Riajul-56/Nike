class ApiSuccess {
  constructor(statusCode = 200, message = 'Success', data = {}, meta = {}) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  //200 ok
  static ok(message = 'Ok', data = {}, meta = {}) {
    return new ApiSuccess(200, message, data, meta);
  }

  //201 created
  static created(message = 'Resource created', data = {}, meta = {}) {
    return new ApiSuccess(201, message, data, meta);
  }

  //204 NO Content(rare,Data wii be empty)
  static noContent(message = 'No Content') {
    return new ApiSuccess(204, message);
  }

  //Custom success
  static custom(statusCode, message, data = {}, meta = {}) {
    return new ApiSuccess(statusCode, message, data, meta);
  }
}
export default ApiSuccess;
