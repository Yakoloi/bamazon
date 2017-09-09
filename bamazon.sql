DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(20),
  department_name VARCHAR(20),
  price FLOAT(8, 2),
  stock_quantity INTEGER(5),
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity) values ("soda", "drinks", 4, 70);


SELECT * FROM products;