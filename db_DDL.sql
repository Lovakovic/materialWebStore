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
