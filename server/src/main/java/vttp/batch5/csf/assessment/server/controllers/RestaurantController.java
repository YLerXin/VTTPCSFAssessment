package vttp.batch5.csf.assessment.server.controllers;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import javax.print.attribute.standard.Media;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.batch5.csf.assessment.server.models.menuitems;
import vttp.batch5.csf.assessment.server.services.RestaurantService;
@Controller
@RequestMapping(path="/api")
public class RestaurantController {
@Autowired
private RestaurantService resSvc;

  // TODO: Task 2.2
  // You may change the method's signature

@GetMapping(path="/menu", produces=MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> getMenus() {
    List<menuitems> items = resSvc.getMenu();

    JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
    for(menuitems item:items){
      JsonObject obj = Json.createObjectBuilder()
      .add("id",item.get_id())
      .add("name",item.getName())
      .add("description",item.getDescription())
      .add("price",item.getPrice())
      .build();
      arrBuilder.add(obj);
    }
    JsonArray result = arrBuilder.build();

    return ResponseEntity.ok(result.toString());
  }

  @PostMapping(path="/food_order", consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE)
  @ResponseBody
  // TODO: Task 4
  // Do not change the method's signature
  public ResponseEntity<String> postFoodOrder(@RequestBody String payload) {
    
    JsonObject req = Json.createReader(new StringReader(payload)).readObject();
   
    String username = req.getString("username");
    String password = req.getString("password");
    JsonArray itemsArr = req.getJsonArray("items");

    if(!resSvc.existsByUsernamePassword(username, password)){
      String jsonResponse = Json.createObjectBuilder()
      .add("message","Invalid username and/or password")
      .build().toString();

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(jsonResponse);
    }

    List<JsonObject> itemsList = new ArrayList<>();
    for(int i = 0; i < itemsArr.size(); i++){
      JsonObject o = itemsArr.getJsonObject(i);
      itemsList.add(o);
  }

    double totalCost = 0.0;
    for (JsonObject o: itemsList){
      double price = o.getJsonNumber("price").doubleValue();
      int qty = o.getInt("quantity");
      totalCost += (price*qty);
    }

      String order_id = UUID.randomUUID().toString().substring(0,8);
     
      JsonObject paymentResp = null;
    try{
      paymentResp = resSvc.sendPaymentToGateway(username, order_id, totalCost);
    }catch(Exception ex){
      String err = Json.createObjectBuilder()
      .add("error", "payment gateway failed: " + ex.getMessage())
      .build().toString();
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(err);
    }

    String paymentId = paymentResp.getString("payment_id");
    long timestamp = paymentResp.getJsonNumber("timestamp").longValue();

    java.sql.Date orderDate = new java.sql.Date(timestamp);
    resSvc.insertPlaceOrder(order_id, paymentId, orderDate, totalCost, username);

    JsonObject success = Json.createObjectBuilder()
        .add("message", "Order and payment successful")
        .add("orderId", order_id)
        .add("paymentId", paymentId)
        .add("total", totalCost)
        .add("timestamp", timestamp)
        .build();

    return ResponseEntity.ok(success.toString());


    }
  
  }





