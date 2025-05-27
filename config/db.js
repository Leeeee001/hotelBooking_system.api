let mongoose = require("mongoose");

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database is connected sucessfully...")
    } catch (err) {
        console.log("Database connection failed...", err.message)
    }
};

module.exports = dbConnect;
