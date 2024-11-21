-- Create and use the database
CREATE DATABASE IF NOT EXISTS crm;
USE crm;

-- Customer Table
CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    order_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data into customer table
-- INSERT INTO customer (name, email, phone, address)
-- VALUES 
-- ('Deva', 'asd@gmail.com', '1234567890', '123 Main St'),
-- ('Arjun', 'arjun@example.com', '9876543210', '456 Park Ave');

-- Insert sample data into orders table
-- INSERT INTO orders (customer_id, product_name, order_date, amount)
-- VALUES 
-- (1, 'Bus', '2024-10-10', 5000.00),
-- (2, 'Car', '2024-11-12', 15000.00);

-- Audience Conditions Table
CREATE TABLE IF NOT EXISTS audience_conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segment_name VARCHAR(255) NOT NULL,
    conditions_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into audience_conditions
-- INSERT INTO audience_conditions (segment_name, conditions_json) 
-- VALUES
-- ('HighSpendingCustomers', '{"key":"total_spending", "operator": ">", "value": 10000}'),
-- ('RareVisitors', '{"key":"total_visits", "operator": "<=", "value": 3}'),
-- ('InactiveLast3Months', '{"key":"last_visit", "operator": ">", "value": 3}');

-- Campaign Table
CREATE TABLE IF NOT EXISTS campaignTable (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    segment_id INT NOT NULL,
    messages TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (segment_id) REFERENCES audience_conditions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data into campaignTable
-- INSERT INTO campaignTable (segment_id, messages)
-- VALUES
-- (1, 'Welcome to our premium plan!'),
-- (2, 'We miss you! Come back soon.');

-- Communications Log Table
CREATE TABLE IF NOT EXISTS communications_log (
    com_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    campaign_id INT NOT NULL,
    com_status VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaignTable(campaign_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data into communications_log
-- INSERT INTO communications_log (customer_id, campaign_id, com_status)
-- VALUES
-- (1, 1, 'Sent'),
-- (2, 2, 'Failed');

-- Customer Segment Table
CREATE TABLE IF NOT EXISTS customer_segment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segment_id INT NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (segment_id) REFERENCES audience_conditions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data into customer_segment
-- INSERT INTO customer_segment (segment_id, customer_id)
-- VALUES
-- (1, 1),
-- (2, 2);

-- Select queries for verification
SELECT * FROM customer;
SELECT * FROM orders;
SELECT * FROM audience_conditions;
SELECT * FROM campaignTable;
SELECT * FROM communications_log;
SELECT * FROM customer_segment;
