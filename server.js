// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quoting_dojo');

app.use(bodyParser.urlencoded());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String,
    likes: Number
});
var Quote = mongoose.model('Quote', QuoteSchema);

QuoteSchema.path('name').required(true, 'Name cannot be blank');
QuoteSchema.path('quote').required(true, 'Quote cannot be blank');

// root route
app.get('/', function(req, res) {
        res.render('index');
});
// route to add a user
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new Quote with the name and quote corresponding to those from req.body
    var quote = new Quote({name: req.body.name, quote: req.body.quote, likes: 0});
    quote.save(function(err){
        if(err){
//            console.log('something went wrong');
            res.render('index', {title: 'you have errors!', errors: quote.errors});
        } else{
            console.log('successfully added a quote!');
            res.redirect('/quotes');
        }
    });
//    res.redirect('/');
});
app.get('/quotes', function(req, res){
    Quote.find({}, function(err, quotes){
        if(err){
            console.log(err);
        } else{
            console.log(quotes);
            res.render('quotes', {quotes: quotes});
        }
    });
});
// listen on 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});