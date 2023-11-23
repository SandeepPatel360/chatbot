const mongoose = require('mongoose');


require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => console.log("DB Connect is Succesfull"))
    .catch((error) => {
        console.log("Issue With Connection of DB");
        console.log(error.message);
        process.exit(1);
    })
}

module.exports = dbConnect;
