/**
 * Omar Sharif, CS 690, Fitness Tracker TODO Project
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
        listTable.sync({force: true});
            /*.then(function () {
            return listTable.create({
                id: '1',
                title: 'household chores 3'
            });
            */
        //});

        itemTable = sequelize.define('item2', {
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
        itemTable.sync({force: true});
        console.log("Successfully connected to the database todoDB");
    }).catch((err) => {
        console.log("Connection attempt failed: " + err);
    });

}

function addList(req, res) {
    listTable.create({
        title: req.body.title
    }).then(() => {
        console.log("Successfully created new table entry");
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
                res.send("List is created");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error fetching table data");
        });
    }).catch((e) => {
        console.error(e);
        res.status(400).send("Error in creating table");
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
        console.error(err);
        res.status(400).send("Error in retrieving lists");
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
                res.send("Item was inserted");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error, item could not be retrieved");
        });
    }).catch((e) => {
        console.error("Error: " + e);
        res.status(400).send("Error, item could not be inserted");
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
            res.status(400).send("Error, item could not be retrieved");
        });
    }).catch((e) => {
        console.log(e);
        res.status(400).send("Error, item could not be updated");
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
            res.send("List is removed and all items associated with it.")
        }).catch((e) => {
            res.status(400).send("Error, items in itemTable could not be removed");
            console.log(e);
        });
    }).catch((e) => {
        res.status(400).send("Error, list in listTable could not be removed");
        console.log(e);
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
