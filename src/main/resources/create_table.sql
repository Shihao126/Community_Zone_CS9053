use java_final;

CREATE TABLE if not exists user (
uid BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Username, must be unique',
password VARCHAR(50) NOT NULL COMMENT 'Password',
gender varchar(10) not null comment 'male or female',
birthday varchar(10) not null comment 'format like 1970-01-01',
education varchar(20),
nationality varchar(20),
has_image tinyint(1) default 0,
image_id bigint,
isactive TINYINT(1) DEFAULT 1 COMMENT 'Whether the data is avaliable',
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

INDEX idx_username (username)
);

create table if not exists token(
uid bigint not null comment 'user id',
token varchar(50) not null comment 'token',
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

primary key(uid)
);



create table if not exists friendship(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
uid bigint not null comment 'uid of person A',
uid2 bigint not null comment 'uid of person B',
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

unique key unique_uids(uid, uid2)
);

create table if not exists friendship_application(
uid bigint not null comment 'uid of person A',
uid2 bigint not null comment 'uid of person B',
detail varchar(1000) comment 'Message sent with the request',
status varchar(10) comment 'WAITING, REFUSED, ACCEPTED',
isactive tinyint(1) default 1 COMMENT 'When the request has been denied, isactive = 0',
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

unique key unique_uids(uid, uid2)
);

create table if not exists chat_record(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
uid bigint not null comment 'uid of person A',
session_type varchar(10) not null comment 'Group or Friend',
session_id varchar(20) not null,
record varchar(2000) not null,
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

index index_session(session_type, session_id, create_time)
);

create table if not exists group_info(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
`name` varchar(50) not null,
description varchar(100),
creater_id bigint not null,
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp'
);



create table if not exists group_member(
group_id bigint not null comment 'id of group_info',
uid bigint not null,
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',
unique key group_id_uid(group_id, uid),
index idx_uid(uid)
);


create table if not exists image(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
file_name varchar(100) not null,
content_type varchar(100) not null,
image_data longblob not null,
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp'
);

create table if not exists blog(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
title varchar(100) not null,
content varchar(2000) not null,
uid bigint not null,
has_image tinyint(1) default 0,
image_id bigint,
permission varchar(10) comment 'PRIVATE, FRIEND, PUBLIC',
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp'
);


create table if not exists comment(
id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key ID',
blog_id bigint not null,
uid bigint not null,
content varchar(1000) not null,
isactive tinyint(1) default 1,
create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',

index idx_blog_id(blog_id)
);