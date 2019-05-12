const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise= global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
})
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => console.log(err));

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    res.render('index')
});

// About route
app.get('/about', (req, res) => {
    res.render('about')
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
