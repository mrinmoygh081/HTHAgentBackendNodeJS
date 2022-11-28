const mongoose = require('mongoose');
const app = require("./app");
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`app is running port ${port}..`);
});

const DB = 'mongodb+srv://hthcabs:hthcabs@cluster0.g4bbhup.mongodb.net/?retryWrites=true&w=majority'

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!')).catch((err) => {
        console.log(err);
    });