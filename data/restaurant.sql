-- IMPORTANT: DO NOT CHANGE THE GIVEN SCHEMA UNLESS YOU HAVE A GOOD REASON
-- IF YOU DO CHANGE IT WRITE THE JUSTIFICATION IN A COMMENT ABOVE THE CHANGE

drop database if exists restaurant;

create database restaurant;

use restaurant;
--to ensure customers name exist in place orders
create table customers (
/*   username varchar(64) not null,
 */ username varchar(64) not null unique,
    password varchar(128) not null
);

insert into customers(username, password) values
  ('fred', sha2('fred', 224)),
  ('barney', sha2('barney', 224)),
  ('wilma', sha2('wilma', 224)),
  ('betty', sha2('betty', 224)),
  ('pebbles', sha2('pebbles', 224));

-- TODO: Task 1.2
-- Write your task 1.2 below

create table place_orders(
order_id char(8) primary key,
payment_id varchar(128) unique,
order_data date,
total DECIMAL(8,2),
username varchar(64)
);
