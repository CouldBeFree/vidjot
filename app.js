const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    res.render('index')
});

// About route
app.get('/about', (req, res) => {
    res.send('ABOUT')
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
