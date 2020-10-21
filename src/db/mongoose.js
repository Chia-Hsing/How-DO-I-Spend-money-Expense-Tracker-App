const mongoose = require('mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/expense-tracker-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('DB connect successfully!')
    })
    .catch(e => console.log(e))
