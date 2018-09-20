/**
 * Omar Sharif, CS 690, Fitness Tracker TODO Project
 * https://www.youtube.com/watch?v=pKd0Rpw7O48&t=621s
 * https://www.youtube.com/watch?v=TlB_eWDSMt4
 * https://www.robinwieruch.de/postgres-express-setup-tutorial/
 * https://codeforgeek.com/2017/01/getting-started-sequelize-postgresql/
 */

const express = require('express');
const app = express(); // read in the express module and create application
app.use(express.json());

const database = require('./todoDB'); // connect to database
database.connect();

app.post('/list/create', (req, res) => {
    if (!req.body.title || req.body.title.length < 1) {
        res.status(400).send("title is required and should be minimum 1 character");
    }
    else {
        database.addList(req, res);
    }
});


app.get('/list', (req, res) => {
    database.getLists(res);
});



app.post('/list/item/create', (req, res) => {
    var id = req.body.id;
    console.log('id = ' + id);
    if (!id)
        res.status(400).send("list id is required!");
    else if (!req.body.content || req.body.content.length == 0)
        res.status(400).send("content is required and should be minimum 1 character");
    else {
        console.log('adding item');
        database.addItem(req, res);
    }
});


app.put('/list/item', (req, res) => {
    var id = req.body.id;
    console.log('id = ' + id);
    if (!id)
        res.status(400).send("Item id is required.");
    else {
        database.updateItem(req, res);
    }
});

app.delete('/list/delete', (req, res) => {
    var id = req.body.id;
    if (!id)
        res.status(400).send("Invalid list ID");
    else {
        database.deleteList(req, res);
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));