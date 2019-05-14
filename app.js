const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise= global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => console.log(err));

// Connect model idea
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    res.render('index')
});

// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({ text:'Please add a title' })
    }
    if(!req.body.details){
        errors.push({ text:'Please add a details' })
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            })
    }
});

// Add idea form
app.get('/ideas/add', (req, res) => {
   res.render('ideas/add');
});

// Idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            })
        });
});

// About route
app.get('/about', (req, res) => {
    res.render('about')
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
