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

ALTER TABLE product ADD CONSTRAINT fkProduct_categoryId
FOREIGN KEY (categoryId) REFERENCES category(id);

# Keep the 'complexity' inside of DB rather than code
CREATE VIEW completeProducts AS
SELECT product.id AS id, title, price, category.name AS category, product.description AS description, image
FROM product JOIN category ON product.categoryId = category.id;

CREATE TABLE user (
     id INT PRIMARY KEY AUTO_INCREMENT,
     username VARCHAR(32) NOT NULL,
     password CHAR(60) NOT NULL,
     email VARCHAR(256) NOT NULL,
     createdAt DATETIME DEFAULT NOW(),
     updatedAt DATETIME,
     role CHAR(3) DEFAULT 'usr'
);

# Create a trigger so we don't have to worry about updating anywhere else
CREATE TRIGGER userModified BEFORE UPDATE ON user
FOR EACH ROW
BEGIN
    SET NEW.updatedAt = NOW();
END;

CREATE TABLE address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    name VARCHAR(64) NOT NULL,
    addressNickname VARCHAR(64),
    companyName VARCHAR(128),
    street VARCHAR(100) NOT NULL,
    city VARCHAR(45) NOT NULL,
    zipCode VARCHAR(16),
    country VARCHAR(75) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    deliveryInstructions TEXT,
    main BOOLEAN NOT NULL DEFAULT FALSE,
    lastModified DATETIME DEFAULT NOW()
);

ALTER TABLE address ADD CONSTRAINT fkAddress_userId
FOREIGN KEY (userId) REFERENCES user(id);

# Create a trigger so we don't have to worry about updating anywhere else
CREATE TRIGGER addressModified BEFORE UPDATE ON address
FOR EACH ROW
BEGIN
   SET NEW.lastModified = NOW();
END;

# Some dummy product data
INSERT INTO category (name, description) VALUES
('Electronics', 'Electronic gadgets such as mobile phones, earphones or bluetooth speakers.'),
('Shoes', 'Footwear for men or women.'),
('Computer parts', 'Parts for building a computer.');

INSERT INTO product (title, price, categoryId, description, image) VALUES
('Dummy phone', 830, 1, 'Hey, look at me! I am a dummy phone.', 's23_uncropped.png'),
('Dummy shoe', 130, 2, 'Hey, look at me! I am a dummy sneaker.', 'AF1_low_unc_white.webp'),
('Dummy part', 1399, 3, 'Hey, look at me! I am a dummy RTX 4090.', '4090_fe.webp');

# Insert user through registration page because of password hashing, then alter
# the user's role to 'adm' with a query

# A few addresses with different attributes omitted
INSERT INTO address (userId, name, addressNickname, street, city, zipCode, country, phone) VALUE
(1, 'Ivo Markovic', 'Budapest apartment', 'Harosz Matyak street 4', 'Budapest', '16500', 'Hungary', '92 837 1847');
INSERT INTO address (userId, name, addressNickname, companyName, street, city, zipCode, country, phone,
                     deliveryInstructions, main) VALUE
(1, 'Danijel Franko', 'Danko\'s place (full)', 'KingICT', 'Ulica Hrvatskih Uhljeba 15', 'Zagreb', '10000', 'Croatia',
 '95 927 7112', 'Last doors at the end of the hall of the first floor. Just leave the packet at the doorstep.', true);
INSERT INTO address (userId, name, street, city, zipCode, country, phone) VALUE
    (1, 'Tony Filipovic', 'Ulica Ive Sanadera 1', 'Rijeka', '51000', 'Croatia', '92 274 1927');
