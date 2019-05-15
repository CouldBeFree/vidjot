const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));

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

// Edit idea
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(ideas => {
            res.render('ideas/edit', {
                ideas: ideas
            })
        })
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

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    res.redirect('/ideas')
                })
        })
});

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            res.redirect('/ideas')
        })
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
