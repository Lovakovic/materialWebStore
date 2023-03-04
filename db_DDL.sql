DROP DATABASE IF EXISTS webShop;
CREATE DATABASE webShop;
USE webShop;

CREATE TABLE product(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
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
    SELECT product.id AS id, product.name AS name, price, category.name AS category, product.description AS description, image
    FROM product JOIN category ON product.categoryId = category.id;

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
                         lastModified DATETIME DEFAULT NOW()
);

ALTER TABLE address ADD CONSTRAINT fkAddress_userId
    FOREIGN KEY (userId) REFERENCES user(id);

ALTER TABLE user ADD CONSTRAINT fkUser_primaryAddressId
    FOREIGN KEY (primaryAddressId) REFERENCES address(id);

# Update the addressModified field automatically
CREATE TRIGGER addressModified BEFORE UPDATE ON address
    FOR EACH ROW
BEGIN
    SET NEW.lastModified = NOW();
END;

# Remove primary address foreign key from user to enable deletion of address
CREATE TRIGGER deletePrimaryAddressId BEFORE DELETE ON address
    FOR EACH ROW
BEGIN
    DECLARE v_isPrimary BOOLEAN DEFAULT FALSE;
    SELECT OLD.id = primaryAddressId INTO v_isPrimary FROM user WHERE user.id = OLD.userId;

    IF v_isPrimary THEN
        UPDATE user SET primaryAddressId = NULL WHERE id = OLD.userId;
    END IF;
END;

CREATE TABLE cartItem (
    userId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT DEFAULT 1,
    addedAt DATETIME DEFAULT NOW()
);

ALTER TABLE cartItem
    ADD CONSTRAINT fkCartItem_userId FOREIGN KEY (userId) REFERENCES user(id),
    ADD CONSTRAINT fkCartItem_productId FOREIGN KEY (productId) REFERENCES product(id);

CREATE VIEW cart AS
SELECT product.name AS name, cartItem.quantity AS quantity, product.price AS price,
       image, userId, productId, addedAt
FROM user JOIN cartItem ON user.id = cartItem.userId
          JOIN product ON cartItem.productId = product.id;


# Some dummy product data
INSERT INTO category (name, description) VALUES
                                             ('Electronics', 'Electronic gadgets such as mobile phones, earphones or bluetooth speakers.'),
                                             ('Shoes', 'Footwear for men or women.'),
                                             ('Computer parts', 'Parts for building a computer.');

INSERT INTO product (name, price, categoryId, description, image) VALUES
                                                                       ('Dummy phone', 830, 1, 'Hey, look at me! I am a dummy phone.', 's23_uncropped.png'),
                                                                       ('Dummy shoe', 130, 2, 'Hey, look at me! I am a dummy sneaker.', 'AF1_low_unc_white.webp'),
                                                                       ('Dummy part', 1399, 3, 'Hey, look at me! I am a dummy RTX 4090.', '4090_fe.webp');

# A few addresses with different non-mandatory attributes omitted
INSERT INTO address (userId, name, addressNickname, companyName, street, city, zipCode, country, phone,
                     deliveryInstructions) VALUE
(1, 'Danijel Franko', 'Danko\'s place (full)', 'KingICT', 'Ulica Hrvatskih Uhljeba 15', 'Zagreb', '10000', 'Croatia',
 '95 927 7112', 'Last doors at the end of the hall of the first floor. Just leave the packet at the doorstep.');
INSERT INTO address (userId, name, street, city, zipCode, country, phone) VALUE
    (1, 'Tony Filipovic', 'Ulica Ive Sanadera 1', 'Rijeka', '51000', 'Croatia', '92 274 1927');
INSERT INTO address (userId, name, addressNickname, street, city, zipCode, country, phone) VALUE
    (1, 'Ivo Markovic', 'Budapest apartment', 'Harosz Matyak street 4', 'Budapest', '16500', 'Hungary', '92 837 1847');

# Insert user through registration page because of password hashing, then alter
# the user's role to 'adm' with a query
