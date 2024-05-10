const sleep = async (time_in_milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, time_in_milliseconds));
}

module.exports = {
    sleep
}