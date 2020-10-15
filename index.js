const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ol4yj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("Welcome, Mohammad Tareq");
})

client.connect(err => {
    const usersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_USER);
    const adminCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_ADMIN);
    const serviceCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_SERVICE);
    const reviewCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_REVIEW);
    const orderCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_ORDER);

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/orders/:email', (req, res) => {
        orderCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/admin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })
    app.get('/services/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    app.post('/order', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.insertedCount > 0)
                }
                else {
                    res.status(404).send('Error 404');
                }
            })
    })
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.insertedCount > 0)
                }
                else {
                    res.status(404).send('Error 404');
                }
            })
    })
    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.insertedCount > 0)
                }
                else {
                    res.status(404).send('Error 404');
                }
            })
    })
    app.post('/review', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.insertedCount > 0)
                }
                else {
                    res.status(404).send('Error 404');
                }
            })
    })
    app.patch('/orders/:id', (req, res) => {
        orderCollection.updateOne({_id:ObjectId(req.params.id)},
        {
         $set:{status:req.body.status}
     })
        .then(result => {
         res.send(result.modifiedCount > 0);
        })
     })

});
app.listen(process.env.PORT || port);