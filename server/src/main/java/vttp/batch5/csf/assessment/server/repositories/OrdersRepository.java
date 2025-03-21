package vttp.batch5.csf.assessment.server.repositories;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import jakarta.json.JsonObject;
import vttp.batch5.csf.assessment.server.models.menuitems;


@Repository
public class OrdersRepository {
@Autowired
private MongoTemplate template;
  // TODO: Task 2.2
  // You may change the method's signature
  // Write the native MongoDB query in the comment below
  //
  //  Native MongoDB query here
  //db.menus.find({}).sort({name:1})

  //
  
  public List<menuitems> getMenu() {
    Query query = new Query();

    query.with(Sort.by(Sort.Direction.ASC, "name"));

    List<menuitems> items = template.find(query,menuitems.class);

    return items;
  }

  // TODO: Task 4
  // Write the native MongoDB query for your access methods in the comment below
  //
  //  Native MongoDB query here
  public void insertOrderDoc(String orderId, String paymentId, String username, double totalCost, Date orderDate, List<JsonObject> itemsList){
    Document doc = new Document();
    doc.put("_id",orderId);
    doc.put("payment_id", paymentId);
    doc.put("username", username);
    doc.put("total", totalCost);
    doc.put("timestamp", new Date(orderDate.getTime()));

    List<Map<String,Object>> itemArray = new ArrayList<>();
    for (JsonObject o: itemsList){
      Map<String,Object> map = new HashMap<>();
      map.put("id",o.getString("id"));
      map.put("price", o.getJsonNumber("price").doubleValue());
      map.put("quantity", o.getInt("quantity"));
      itemArray.add(map);
  }
  doc.put("items", itemArray);
  template.insert(doc, "orders");

  }
  
}
