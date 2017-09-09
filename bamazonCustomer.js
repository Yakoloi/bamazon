var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "newuser",

    // Your password
    password: "uci123",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    list();
});

function list() {
    connection.query("SELECT * FROM products", function (err, results) {
        var t = new Table
        results.forEach(function (results) {
            t.cell('Product Id', results.item_id)
            t.cell('Department', results.department_name)
            t.cell('Description', results.product_name)
            t.cell('Price, USD', results.price, Table.number(2))
            t.newRow()
        })
        console.log(t.toString());
        start();
    });
}

var userInput;
var quant;
var stock;
var newPrice;
var itemName;

function start() {
    inquirer
        .prompt({
            name: "itemid",
            type: "input",
            message: "input the item ID # of the product you want to buy!",
        })
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id =" + answer.itemid, function (err, res) {
                if (err) throw err;
                userInput = answer.itemid;
                console.log(res[0].department_name + ": " + res[0].product_name + " $" + res[0].price);
                quantityCheck();
            });
        })
}

function quantityCheck() {
    connection.query("SELECT * FROM products WHERE item_id =" + userInput, function (err, res) {
        console.log("There are " + res[0].stock_quantity + " " + res[0].product_name + "s" + " in stock");
        buyItem();
    });
}

function buyItem() {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "how many would you like to buy?",
        })
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id =" + userInput, function (err, res) {
                if (answer.quantity > res[0].stock_quantity) {
                    console.log("Insufficient quantity!")
                } else
                    itemName = res[0].product_name;
                    newPrice = res[0].price;
                    stock = parseInt(res[0].stock_quantity);
                    quant = parseInt(answer.quantity);
                updateQuantity();
            });
        })
}

function updateQuantity() {
    var total = newPrice * quant;
    var sub = stock - quant;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: sub
            },
            {
                item_id: userInput
            }
        ],
        function (err, res) {
            console.log("You have bought " + quant + " " + itemName + "s at $" + newPrice +  " for a total of $" + total);
            console.log("thank you for shopping at bamazon!");
            connection.end();
        }
    );
}