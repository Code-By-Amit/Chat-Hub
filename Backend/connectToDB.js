const mongoose = require('mongoose')

function connectToDB() {
    try {
        mongoose.connect(process.env.MonogDb_URL)
            .then(() => { console.log("Connected To MongoDb Sucessfully") })
            .catch((err) => {
                console.log("Failed to Connect to MongoDb. Error: ", err)
                process.exit(1)
            })
    } catch (error) {
        console.log("Error in ConnectToDB.", error)
    }
}

module.exports = {connectToDB}