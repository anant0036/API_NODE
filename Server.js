const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
    console.log('DB connection successfull!!..🙄🙄'.blue);
});





const port = process.env.PORT;
app.listen(port, () =>
{
    console.log(`App Running on port ${port}🤨🤨`.bold.green);
});

