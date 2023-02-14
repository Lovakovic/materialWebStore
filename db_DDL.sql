CREATE DATABASE webShop;
USE webShop;

CREATE TABLE product(
	id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    categoryId int,
    description VARCHAR(1024),
    image VARCHAR(255)
);

CREATE TABLE category (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(127) NOT NULL,
    description VARCHAR(1024)
);

ALTER TABLE product ADD CONSTRAINT fk_categoryId
FOREIGN KEY (categoryId) REFERENCES category(id);

CREATE TABLE user (
                     id INT PRIMARY KEY AUTO_INCREMENT,
                     username VARCHAR(64) NOT NULL,
                     password CHAR(60) NOT NULL,
                     email VARCHAR(256) NOT NULL,
                     first_name VARCHAR(64) NOT NULL,
                     last_name VARCHAR(64) NOT NULL,
                     phone VARCHAR(20),
                     street_address VARCHAR(95),
                     city VARCHAR(45),
                     zip_code VARCHAR(16),
                     country VARCHAR(75),
                     created_at DATETIME DEFAULT NOW(),
                     updated_at DATETIME,
                     role CHAR(3) DEFAULT 'usr'
);

# Some dummy data
INSERT INTO category (name, description) VALUES
('Electronics', 'Electronic gadgets such as mobile phones, earphones or bluetooth speakers.'),
('Shoes', 'Footwear for men or women.'),
('Computer parts', 'Parts for building a computer.');

INSERT INTO product (title, price, categoryId, description, image) VALUES
('Dummy phone', 830, 1, 'Hey, look at me! I am a dummy phone.', '/media/s23_uncropped.png'),
('Dummy shoe', 130, 2, 'Hey, look at me! I am a dummy shoe with a picture of a phone.', '/media/s23_uncropped.png'),
('Dummy part', 1399, 3, 'Hey, look at me! I am a dummy computer part with a picture of a phone.',
 '/media/s23_uncropped.png');

# Keep the 'complexity' inside of DB rather than code
CREATE VIEW complete_products AS
    SELECT product.id AS id, title, price, category.name AS category, product.description AS description, image
    FROM product JOIN category ON product.categoryId = category.id;
