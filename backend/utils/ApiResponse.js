class ApiResponse {
  constructor(statuscode, data, message = "default") {
    (this.statuscode = statuscode),
      (this.data = data),
      (this.message = message);
      this.success = statuscode >= 300 ? 'false' : 'true'
  }
}
module.exports = ApiResponse;
