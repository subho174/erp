const asynHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req,res,next);
    } catch (error) {
        console.log(error);
    }
};

module.exports = asynHandler