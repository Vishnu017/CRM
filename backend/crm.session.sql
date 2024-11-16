-- CREATE DATABASE crm;
use crm;

-- CREATE TABLE customer(
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     phone VARCHAR(20),
--     address VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    order_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(id) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Customer (name, email, phone, address)
VALUES ('Alice Smith', 'alice@example.com', '1234567890', '123 Main St');
SELECT * FROM customer;

INSERT INTO orders (customer_id, product_name, quantity, price,order_status)
VALUES ('2', 'table', '12', '20', 'Pending');
SELECT* from orders;
drop TABLE`order`;

DESCRIBE orders
ALTER TABLE orders  Modify column order_status VARCHAR(20)