import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { menuitems, Order } from "./models";
import { Observable } from "rxjs";

export class RestaurantService {

  private http = inject(HttpClient)
  // TODO: Task 2.2
  // You change the method's signature but not the name
  getMenuItems():Observable<menuitems[]> {
    return this.http.get<menuitems[]>(`/api/menu`)
  }

  // TODO: Task 3.2

  postFoodOrder(order:Order):Observable<any>{
    return this.http.post<any>(`/api/food_order`,order)
  }
}
