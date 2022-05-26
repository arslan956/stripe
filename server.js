const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const path = require('path')
const User = require('./models/model')
const stripe = require('stripe')('sk_test_51L0fsGI1u5hRZofYnJ0nbEl6ifJ9uvtwbpaZGXkrCsQLRT1qBRY1J0c7yBH4mIgOPRLA4Ru1jmAkPSUeEF6xXx6Q00T63dNWoP')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));


mongoose.connect(process.env.DB_LINK,{useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',error=>console.log(Error));
db.once('open',()=>console.log("MONGODDB IS WORKING NOW"));


app.get('/', (req,res) => {
 res.render('index.html');
})
app.post('/charge', async(req, res) => {
    try {
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: 'Thank you for your generous donation.'
        })).then(() => res.render('complete.html'))
            .catch(err => console.log(err))
    } catch (err) { res.send(err) }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken,
        amount: req.body.amount * 100,
        currency: 'PKR',
        description: 'Thank you for your generous donation.'
    })
    const data=await user.save();
    console.log(data);
});

const port = process.env.PORT|| 5600;
app.listen(port,()=>console.log('Server is listening......!!!'));
