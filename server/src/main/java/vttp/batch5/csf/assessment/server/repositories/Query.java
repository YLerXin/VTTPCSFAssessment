package vttp.batch5.csf.assessment.server.repositories;

public class Query {
    protected static final String SQL_EXISTS_BY_USERNAME_PASSWORD =
    "SELECT COUNT(*) FROM customers WHERE username = ? AND password = ?";
    
    protected static final String SQL_INSERT_ORDER = 
    "INSERT INTO place_orders(order_id,payment_id,order_data,total,username) VALUES (?,?,?,?,?)";


}
