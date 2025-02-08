class ErrorHandler {
    constructor(
        statusCode = 400,
        message = "Something went wrong"
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.success = false
    }
}

export default ErrorHandler