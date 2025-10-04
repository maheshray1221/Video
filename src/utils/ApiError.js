class ApiError extends Error{
    constructor(statusCode,
        message = "Somthing went worng",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode=this.statusCode
        this.data = null
        this.message = message
        this.success= false
        this.errors = errors

        // only for production 
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}