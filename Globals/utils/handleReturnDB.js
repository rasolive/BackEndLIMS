const handleReturnDB = (data = {}) => {
    try {
        if (!data) {
            throw errorLog(`result is missing`, data)
        }

        if (data.status >= 400) {
            throw errorLog(`HTTP STATUS 400+`, data)
        }

        return data
    } catch (error) {
        return error
    }
}

module.exports = handleReturnDB