DROP DATABASE IF EXISTS webShop;
CREATE DATABASE webShop;
USE webShop;

#
# Product-related tables
#

DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(127) NOT NULL,
    description VARCHAR(1024)
);

DROP TABLE IF EXISTS product;
CREATE TABLE product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    categoryId int,
    description VARCHAR(1024),
    image VARCHAR(255),
    CONSTRAINT fkProduct_categoryId FOREIGN KEY (categoryId) REFERENCES category(id)
);

# Keep the 'complexity' inside of DB rather than code
CREATE VIEW completeProducts AS
    SELECT product.id AS id, product.name AS name, price, category.name AS category, product.description AS description, image
    FROM product JOIN category ON product.categoryId = category.id;

#
# User-related tables
#

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL,
    password CHAR(60) NOT NULL,
    email VARCHAR(256) NOT NULL,
    primaryAddressId INT,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME,
    role CHAR(3) DEFAULT 'usr'
);

DROP TABLE IF EXISTS address;
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
     lastModified DATETIME DEFAULT NOW(),
     CONSTRAINT fkAddress_userId FOREIGN KEY (userId) REFERENCES user(id)
);

ALTER TABLE user ADD CONSTRAINT fkUser_primaryAddressId
    FOREIGN KEY (primaryAddressId) REFERENCES address(id);

# Update modifiedAt fields automatically
CREATE TRIGGER userModified BEFORE UPDATE ON user
    FOR EACH ROW
BEGIN
    SET NEW.updatedAt = NOW();
END;

CREATE TRIGGER addressModified BEFORE UPDATE ON address
    FOR EACH ROW
BEGIN
    SET NEW.lastModified = NOW();
END;

# Enable safe deletion of address in case it's referenced as primary
CREATE TRIGGER deletePrimaryAddressId BEFORE DELETE ON address
    FOR EACH ROW
BEGIN
    DECLARE v_isPrimary BOOLEAN DEFAULT FALSE;
    SELECT OLD.id = primaryAddressId INTO v_isPrimary FROM user WHERE user.id = OLD.userId;

    IF v_isPrimary THEN
        UPDATE user SET primaryAddressId = NULL WHERE id = OLD.userId;
    END IF;
END;

#
# Shopping cart & order related
#
DROP TABLE IF EXISTS cartItem;
CREATE TABLE cartItem (
    userId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT DEFAULT 1,
    addedAt DATETIME DEFAULT NOW(),
    CONSTRAINT fkCartItem_userId FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fkCartItem_productId FOREIGN KEY (productId) REFERENCES product(id)
);

CREATE VIEW cart AS
SELECT product.name AS name, cartItem.quantity AS quantity, product.price AS price,
       image, userId, productId, addedAt
FROM user JOIN cartItem ON user.id = cartItem.userId
          JOIN product ON cartItem.productId = product.id
ORDER BY addedAt DESC;

# Updates cartItem in accordance to parameters (inserts, deletes, decrements or increments cartItem)
# Note: `i_quantity` is the total quantity of item that will be set
DROP PROCEDURE IF EXISTS updateCart;
DELIMITER //
CREATE PROCEDURE updateCart(IN i_userId INT, IN i_productId INT, IN i_quantity INT)
BEGIN
    DECLARE v_prevQuantity INT DEFAULT 0;
    SELECT quantity INTO v_prevQuantity FROM cartItem WHERE userId = i_userId AND productId = i_productId;

    # Item to be removed from cart
    IF i_quantity = 0 THEN
        DELETE FROM cartItem WHERE userId = i_userId AND productId = i_productId;

    # Item isn't yet in cart
    ELSEIF v_prevQuantity = 0 THEN
        INSERT INTO cartItem (userId, productId, quantity) VALUE (i_userId, i_productId, i_quantity);

    # Item quantity needs to change
    ELSEIF v_prevQuantity != i_quantity THEN
        UPDATE cartItem SET quantity = i_quantity WHERE userId = i_userId AND productId = i_productId;
    END IF ;
END //
DELIMITER ;

# For preserving addresses that have been used to order items
DROP TABLE IF EXISTS archivedAddress;
CREATE TABLE archivedAddress (
     id INT PRIMARY KEY AUTO_INCREMENT,
     userId INT NOT NULL,
     name VARCHAR(64) NOT NULL,
     companyName VARCHAR(128),
     street VARCHAR(100) NOT NULL,
     city VARCHAR(45) NOT NULL,
     zipCode VARCHAR(16),
     country VARCHAR(75) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     deliveryInstructions TEXT,
     archivedAt DATETIME DEFAULT NOW(),
     CONSTRAINT fkArchivedAddress_userId FOREIGN KEY (userId) REFERENCES user(id)
);

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    archivedAddressId INT NOT NULL,
    status ENUM('created', 'confirmed', 'shipped', 'deleted') DEFAULT 'created',
    total DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME,
    CONSTRAINT fkOrder_userId FOREIGN KEY (userId) REFERENCES user(id),
    CONSTRAINT fkOrder_archivedAddressId FOREIGN KEY (archivedAddressId) REFERENCES archivedAddress(id)
);

DROP TABLE IF EXISTS orderItem;
CREATE TABLE orderItem (
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fkOrderItem_orderId FOREIGN KEY (orderId) REFERENCES `order`(id),
    CONSTRAINT fkOrderItem_productId FOREIGN KEY (productId) REFERENCES product(id)
);

# Moves item from cartItem to orderItem, and archives address used for ordering
DROP FUNCTION IF EXISTS createOrder;
DELIMITER //
CREATE FUNCTION createOrder(i_userId INT, i_addressId INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_itemsInCart, v_archivedAddressId, v_orderId INT DEFAULT 0;
    DECLARE v_orderTotal DECIMAL(10, 2) DEFAULT 0;

    # Check if there are items in cart
    SELECT COUNT(*) INTO v_itemsInCart FROM cartItem WHERE userId = i_userId;
    IF v_itemsInCart = 0 THEN
        RETURN 0;
    END IF;

    # Check if address has already been archived
    SELECT aa.id INTO v_archivedAddressId FROM address a JOIN archivedAddress aa ON
        a.name = aa.name AND a.companyName = aa.companyName AND
        a.street = aa.street AND a.city = aa.city AND
        a.zipCode = aa.zipCode AND a.country = aa.country AND
        a.phone = aa.phone AND a.deliveryInstructions = aa.deliveryInstructions
    WHERE a.userId = i_userId AND a.id = i_addressId;

    # If address isn't archived, copy it to archive
    IF v_archivedAddressId = 0 THEN
        INSERT INTO archivedAddress
            (userId, name, companyName, street, city, zipCode, country, phone, deliveryInstructions) SELECT
             userId, name, companyName, street, city, zipCode, country, phone, deliveryInstructions
        FROM address WHERE id = i_addressId;

        # Then grab its id for referencing inside order
        SELECT LAST_INSERT_ID() INTO v_archivedAddressId;
    END IF;

    # Calculate order total
    SELECT SUM(price * quantity) INTO v_orderTotal FROM cartItem JOIN product ON productId = product.id
                                                   WHERE userId = i_userId;

    # Creat order
    INSERT INTO `order` (userId, archivedAddressId, total) VALUE (i_userId, v_archivedAddressId, v_orderTotal);

    # Grab the new order id
    SELECT LAST_INSERT_ID() INTO v_orderId;

    # Copy items from `cartItem` to `orderItem`
    INSERT INTO orderItem (orderId, productId, quantity, price)
        SELECT v_orderId, productId, quantity, price FROM cartItem JOIN product
            WHERE productId = product.id AND userId = i_userId;

    # Delete the items from cartItem
    DELETE FROM cartItem WHERE userId = i_userId;

    RETURN v_orderId;
END //
DELIMITER ;
