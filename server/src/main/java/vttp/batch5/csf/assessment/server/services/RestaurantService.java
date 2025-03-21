package vttp.batch5.csf.assessment.server.services;

import java.io.StringReader;
import java.sql.Date;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.batch5.csf.assessment.server.models.menuitems;
import vttp.batch5.csf.assessment.server.repositories.OrdersRepository;
import vttp.batch5.csf.assessment.server.repositories.RestaurantRepository;

@Service
public class RestaurantService {
  @Autowired
  private OrdersRepository orderRepo;
  @Autowired
  private RestaurantRepository restRepo;

  // TODO: Task 2.2
  // You may change the method's signature
  public List<menuitems> getMenu() {
    return orderRepo.getMenu();
  }
  
  // TODO: Task 4

  public boolean existsByUsernamePassword(String username,String password){
    return restRepo.existsByUsernamePassword(username,password);
  }

  private static String Pay_URL = "https://payment-service-production-a75a.up.railway.app/api/payment";

  public JsonObject sendPaymentToGateway(String username,String orderId, double totalCost) throws Exception{
    JsonObject payReq = Json.createObjectBuilder()
    .add("order_id",orderId)
    .add("payer",username)
    .add("payee","Yong Ler Xin")
    .add("payment",totalCost)
    .build();

    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    //double check
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
    headers.set("X-authenticate",username);

    HttpEntity<String> requestEntity = new HttpEntity<>(payReq.toString(),headers);

    ResponseEntity<String> resp = restTemplate.postForEntity(Pay_URL,requestEntity,String.class);

    if (resp.getStatusCode().is2xxSuccessful()){
      String body = resp.getBody();

      JsonObject respJson = Json.createReader(new StringReader(body)).readObject();
      return respJson;
    }else{
      throw new Exception("error rest");
    }

  }

  public void insertPlaceOrder(String orderId,String paymentId, Date orderDate, double totalCost,String username){
    restRepo.insertPlaceOrder(orderId, paymentId, orderDate, totalCost, username);
  }
  public void insertOrderDoc(String orderId, String paymentId,String username, double totalCost,java.util.Date orderDate,List<JsonObject> itemsList){
    orderRepo.insertOrderDoc(orderId, paymentId, username, totalCost, orderDate, itemsList);
  }

}
