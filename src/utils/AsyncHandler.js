const AsyncHandler = (request) => {
    return (req, res, next) => {
        Promise
        .resolve(request(req, res, next))
        .catch((error) => next(error))
    }
}

export default AsyncHandler