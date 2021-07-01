const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')

})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.na2s6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("Connection error:", err)
    const eventCollection = client.db("volunteer").collection("events");
    console.log("Database connected successfully")
    
    app.get('/events', (req, res)=>{
        eventCollection.find()
        .toArray((error, events)=>{
            res.send(events)
        })
        
    })
    
    app.post('/addEvent', (req, res)=>{
        const newEvent = req.body;
        console.log("adding new event: ", newEvent)
        eventCollection.insertOne(newEvent)
        .then(result=>{
            console.log('inserted count: ' , result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('deleteEvent/:id', (req, res)=>{
        const id = ObjectID(req.params.id);
        console.log('delete this ', id)
        eventCollection.findOneAndDelete({_id: id})
    })

});




app.listen(port)