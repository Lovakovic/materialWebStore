#
# Mock data
#
INSERT INTO category (name, description) VALUES
 ('Electronics', 'Electronic gadgets such as mobile phones, earphones or bluetooth speakers.'),
 ('Shoes', 'Footwear for men or women.'),
 ('Computer parts', 'Parts for building a computer.');

INSERT INTO product (name, price, categoryId, description, image) VALUES
  ('Dummy phone', 830, 1, 'Hey, look at me! I am a dummy phone.', 's23_uncropped.png'),
  ('Dummy shoe', 130, 2, 'Hey, look at me! I am a dummy sneaker.', 'AF1_low_unc_white.webp'),
  ('Dummy part', 1399, 3, 'Hey, look at me! I am a dummy RTX 4090.', '4090_fe.webp');

# Insert admin with password = adminpass and user with password = userpass
INSERT INTO user (id, username, password, email, role) VALUES
    (1, 'admin', '$2b$10$zr/wOggWaTeD1yzyc65/kezK4e5Mj1.2tZW6IUviAbnaO0AxktBNS', 'admin@mail.com', 'adm'),
    (2, 'user', '$2a$10$ZM3iMgisxW0Y47nQuVQVaOf4MlVomkBzB8DDTbCI2a6TfvFDCazwC', 'user@mail.com', 'usr');

# A few user-addresses with different non-mandatory attributes omitted
INSERT INTO address (userId, name, addressNickname, companyName, street, city, zipCode, country, phone,
                     deliveryInstructions) VALUE
    (1, 'Danijel Franko', 'Danko\'s place (full)', 'KingICT', 'Ulica Hrvatskih Uhljeba 15', 'Zagreb', '10000', 'Croatia',
     '95 927 7112', 'Last doors at the end of the hall of the first floor. Just leave the packet at the doorstep.');
INSERT INTO address (userId, name, street, city, zipCode, country, phone) VALUE
    (1, 'Tony Filipovic', 'Ulica Ive Sanadera 1', 'Rijeka', '51000', 'Croatia', '92 274 1927');
INSERT INTO address (userId, name, addressNickname, street, city, zipCode, country, phone) VALUE
    (1, 'Ivo Markovic', 'Budapest apartment', 'Harosz Matyak street 4', 'Budapest', '16500', 'Hungary', '92 837 1847');

# Assign a primary address to admin
UPDATE user SET primaryAddressId = 1 WHERE id = 1;
