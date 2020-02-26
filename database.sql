CREATE TABLE users(
user_id SERIAL NOT NULL,
first_name VARCHAR(255) NOT NULL,
second_name VARCHAR(255),
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
isMale BOOL,
profile_picture_url VARCHAR(255),
birth_date DATE,
date_created DATE NOT NULL,
date_updated DATE,
PRIMARY KEY (user_id)
);

CREATE TABLE posts(
post_id SERIAL NOT NULL,
user_id SERIAL NOT NULL,
description  VARCHAR(255) NOT NULL,
type VARCHAR(255) NOT NULL,
date_created DATE NOT NULL,
date_updated DATE,
PRIMARY KEY (post_id),
FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


CREATE TABLE followings(
user_id SERIAL NOT NULL UNIQUE, 
following_id SERIAL NOT NULL UNIQUE, 
FOREIGN KEY (user_id) REFERENCES Users(user_id),
FOREIGN KEY (following_id) REFERENCES Users(user_id)
);

CREATE TABLE comments(
comment_id SERIAL NOT NULL,
post_id SERIAL NOT NULL,
user_id SERIAL NOT NULL,
content TEXT NOT NULL,
date_created DATE NOT NULL,
date_updated DATE,
PRIMARY KEY (comment_id),
FOREIGN KEY (post_id) REFERENCES Posts(post_id),
FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE messages(
message_id SERIAL NOT NULL,
user_id_from SERIAL NOT NULL,
user_id_to SERIAL NOT NULL,
content TEXT NOT NULL,
date_created DATE NOT NULL,
PRIMARY KEY (message_id),
FOREIGN KEY (user_id_from) REFERENCES Users(user_id),
FOREIGN KEY (user_id_to) REFERENCES Users(user_id)
);

CREATE TABLE likes(
user_id SERIAL NOT NULL UNIQUE ,
post_id SERIAL NOT NULL UNIQUE ,
PRIMARY KEY (user_id, post_id),
FOREIGN KEY (post_id) REFERENCES Posts(post_id),
FOREIGN KEY (user_id) REFERENCES Users(user_id)
);