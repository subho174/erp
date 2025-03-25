class ApiError extends Error {
  constructor(
    statuscode,
    message, 
    errors = []
){
    super(message)
    this.statuscode = statuscode,
    this.message = message
    this.success = false
    this.errors = errors
  }
}

module.exports = ApiError;
