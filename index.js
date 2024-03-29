// Importing the needed files 
var express = require('express')
var mongoose = require('mongoose')
var app = express()
const path = require('path')
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file


// Property 
const Handlebars = require('handlebars');
Handlebars.create({ allowProtoMethodsByDefault: true });

// pass the request we will be loading 
var bodyParser = require('body-parser');



// connecting my hostname and port

const hostname = process.env.HOST;
const port = process.env.PORT;

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Register a custom Handlebars helper
const hbs = exphbs.create({
    extname: '.hbs',
  });
  
  // Register the Handlebars engine with Express
  app.engine('hbs', hbs.engine);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'handlebars');

  
  // Set the default view engine to Handlebars
  app.set('view engine', 'hbs');

  var database = require('./config/assconfig')
  var Product = require('./models/product')
  // connect to the mongodb database 
  mongoose.connect('mongodb://localhost:27017/products');
  let myDB = mongoose.connection;


  myDB.once("open", function(){
    console.log("Connected to the Database")
  });

  myDB.on("error", function(){
    console.log("Error why connecting to database");
  })

  // Define a route for the root path ('/')
  app.get('/', async (req, res) => {
    
    try {
        const productData = await Product.find({}).lean().exec();

        res.render('partials/index', { title:"Assignment 4 Last Assignment!!", data: productData});
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/product', async function(req, res) {
    try {
        console.log(req.body);

        // Create a new employee record
        const product = await Product.create({
            asin: req.body.asin,
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            stars: req.body.stars,
            reviews: req.body.reviews,
            price: req.body.price,
            listPrice: req.body.listPrice,
            categoryName: req.body.categoryName,
            isBestSeller: req.body.isBestSeller,
            reviews: req.body.reviews,
            boughtInLastMonth: req.body.boughtInLastMonth,
        });

        // Get all employees after creating the new record
        const products = await Product.find();

        // Send the list of all employees as a response
        
        res.redirect('partials/index')
    } catch (err) {
        // Handle errors
        res.status(500).send(err.message);
    }
});

app.get('/api/product', (req, res) =>{
    res.render('partials/product');
});


app.get('/api/product/:asia', function(req, res) {
    let id = req.params.asin;
    // Use a promise to find an employee by ID
    Product.findById(id)
        .then(product => {
            // If the employee is found, send it as a JSON response
            res.json(product);
        })
        .catch(err => {
            // If there's an error or the employee is not found, send an error response
            res.status(404).send('Employee not found');
        });
});

function editProduct(id) {
    // Send a PUT request to /api/product/:id
    fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Include any data you want to update
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to edit product');
        }
        // Handle successful response
        // For example, reload the page or display a success message
    })
    .catch(error => {
        console.error('Error editing product:', error);
        // Handle error, for example, display an error message to the user
    });
}



// create employee and send back all employees after creation
app.put('/api/product/:asin', function(req, res) {
    let id = req.params.id;
    let data = {
        asin: req.body.asin,
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        stars: req.body.stars,
        reviews: req.body.reviews,
        price: req.body.price,
        listPrice: req.body.listPrice,
        categoryName: req.body.categoryName,
        isBestSeller: req.body.isBestSeller,
        reviews: req.body.reviews,
        boughtInLastMonth: req.body.boughtInLastMonth,
    };

    // Update the employee using findByIdAndUpdate
    Product.findByIdAndUpdate(id, data, function(err, product) {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.send('Successfully updated employee: ' + product.title);
    });
});




  // Define a wildcard route to handle any other paths
app.get('*', function(req, res) {
    // Render the 'partials/error.hbs' template with the provided data for any other routes
    res.render('partials/error', { title: 'Error', message: 'Wrong Route' });

  });
  
  // Start the Express application and listen on the specified port
  app.listen(port, () => {
    console.log(`Example app listening at http://${hostname}:${port}`);
  });