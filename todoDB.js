/**
 * Omar Sharif, CS 690, Fitness Tracker
 */

const Sequelize = require('sequelize');
const sequelize = new Sequelize('todoDB', 'omarsharif', 'omar', {
    host: 'localhost',
    dialect: 'postgres', // this to choose type of DB used
    pool: {
        max: 9,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false // this will stop adding createdAt columns or including them in the queries
    }
});

var itemTable, listTable;

function connectToDatabase() {
    sequelize.authenticate().then(() => {
        listTable = sequelize.define('list', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }, {
            freezeTableName: true
        });
        itemTable = sequelize.define('item', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            listid: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            freezeTableName: true
        });
        console.log("Successfully connected to the database todoDB");
    }).catch((err) => {
        console.log("Connection attempt failed");
    });
}

function addList(req, res) {
    listTable.create({
        title: req.body.title
    }).then(() => {
        console.log("Insert Success.");
        listTable.findAll({
            where: {
                title: req.body.title
            }
        }).then((data) => {
            if (data.length > 0) {
                const list = {
                    id: data[data.length - 1].id,
                    title: data[data.length - 1].title,
                };
                res.send(list);
            }
            else {
                res.send("List is created.");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error, response code 400");
        });
    }).catch((e) => {
        console.error("Error: " + e);
        res.status(400).send("Error, response code 400");
    });
}

function getLists(res) {
    listTable.findAll().then((data) => {
        var lists = [];
        for (var i = 0; i < data.length; i++) {
            const l = {
                id: data[i].id,
                title: data[i].title,
            };
            lists.push(l);
        }
        res.send(lists);
    }).catch((err) => {
        res.status(400).send("Error, response code 400");
        console.error(err);
    });
}


function addItem(req, res) {
    itemTable.create({
        content: req.body.content,
        listid: req.body.id,
    }).then(() => {
        console.log("Item was successfully inserted");
        itemTable.findAll({
            where: {
                content: req.body.content,
                listid: parseInt(req.body.id),
            }
        }).then((data) => {
            if (data.length > 0) {
                const item = {
                    id: data[data.length - 1].id,
                    content: data[data.length - 1].content,
                    listid: data[data.length - 1].listid
                };
                res.send(item);
            }
            else {
                res.send("Item is added.");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error, response code 400");
        });
    }).catch((e) => {
        console.error("Error: " + e);
        res.status(400).send("Error, response code 400");
    });
}

function updateItem(req, res) {
    itemTable.update({
        content: req.body.content,
    }, {
        where: {
            id: req.body.id
        }
    }).then(() => {
        console.log('Item was successfully updated');
        itemTable.findAll({
            where: {
                id: req.body.id
            }
        }).then((data) => {
            if (data.length > 0) {
                const item = {
                    id: data[data.length - 1].id,
                    content: data[data.length - 1].content,
                    listid: data[data.length - 1].listid
                };
                res.send(item);
            }
            else {
                res.send("Item updated");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error, response code 400");
        });
    }).catch((e) => {
        console.log("Error" + e);
        res.status(400).send("Error, response code 400");
    });
}

function deleteList(req, res) {
    listTable.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        itemTable.destroy({ // delete items for the list
            where: {
                listid: req.body.id
            }
        }).then(() => {
            res.send("List is delete with all the items related to it.")
        }).catch((e) => {
            res.status(400).send("Error, response code 400");
            console.log("Error" + e);
        });
    }).catch((e) => {
        res.status(400).send("Error, response code 400");
        console.log("Error" + e);
    });
}


module.exports = {
    connect: connectToDatabase,
    addList: addList,
    getLists: getLists,
    addItem: addItem,
    updateItem: updateItem,
    deleteList: deleteList,
};
