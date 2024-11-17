-- CREATE DATABASE crm;
use crm;

CREATE TABLE customer(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    -- quantity INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    order_date DATE,
    -- order_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(id) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Customer (name, email, phone, address)
VALUES ('Deva', 'asd@gail.com', '1234567890', '123 Main St');
SELECT * FROM customer;

INSERT INTO orders (customer_id, product_name, order_date,amount)
VALUES ('1', 'car', '2024-10-10', '2000');
SELECT* from orders;
drop TABLE visits;

DESCRIBE customer
DELETE from customer
DELETE from orders
ALTER TABLE orders  add order_date DATE

alter table orders drop column order_status ;

ALTER TABLE orders
RENAME COLUMN price to amount;

CREATE TABLE visits(
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    visit_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
)   


-- This automatically resets AUTO_INCREMENT to 1
SET  @num := 0;
UPDATE customer SET id = @num := (@num+1);
ALTER TABLE customer AUTO_INCREMENT =1;