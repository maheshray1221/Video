const asyncHandler = (fn)=>{
    (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=> next(err))
    }
}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         console.log(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
//  }