package vttp.batch5.csf.assessment.server.repositories;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

// Use the following class for MySQL database
@Repository
public class RestaurantRepository {
@Autowired
private JdbcTemplate template;

public boolean existsByUsernamePassword(String username, String password){
    Integer count = template.queryForObject(
        Query.SQL_EXISTS_BY_USERNAME_PASSWORD, Integer.class, username , password
);
return (count != null && count > 0);
}

public void insertPlaceOrder(String orderId,String paymentId, Date orderDate, double totalCost,String username){
    template.update(Query.SQL_INSERT_ORDER,orderId, paymentId, orderDate, totalCost, username);
}

}
