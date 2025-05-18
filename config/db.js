let mongoose = require("mongoose");

let dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database is connected sucessfully...")
    } catch (err) {
        console.log("Database connection failed...", err.message)
    }
};

module.exports = dbConnect;
