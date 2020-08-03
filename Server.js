const mongoose = require('mongoose');
const dotenv = require('dotenv');

//!error    
// process.on('uncaughtException', err => {
//     console.log('Unhandled Exception! 😓😕 Shutting down....'.red.bgWhite);
//     console.log(err.name, err.message);
//     process.exit(1);
// });

dotenv.config({ path: './config.env' });
const colors = require('colors');
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);


//mongoose
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() =>{
    //console.log(con.connection);
    console.log('DB connection successfull!!..🙄🙄'.cyan);
    console.log('------------------------------------'.bgYellow)

});





const port = process.env.PORT;
app.listen(port, () =>
{
    console.log('------------------------------------'.bgYellow)
    console.log(`App Running on port ${port}🤨🤨`.green);
});



//!error 
// process.on('unhandledRejection', err => {
//     console.log('Unhandled Rejection! 😓😕 Shutting down....'.red.bgWhite);
    // console.log(err.name,err.message);
//     server.close(() =>{
//         process.exit(1);
//     });
// });



// console.log(x);