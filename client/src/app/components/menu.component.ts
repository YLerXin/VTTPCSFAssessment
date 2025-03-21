import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Observable, Subscription } from 'rxjs';
import { menuitems } from '../models';
import { CartStore } from '../restaurantStore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit,OnDestroy {
  // TODO: Task 2

  private restSvc = inject(RestaurantService)
  private cartStore = inject(CartStore)
  private router = inject(Router)

  menuitems$!:Observable<menuitems[]>

  itemCount!: number
  total=0

  private cartCountSubscription!: Subscription;
  private totalPriceSubscription! :Subscription


ngOnInit(): void {
  this.menuitems$ = this.restSvc.getMenuItems()
  this.menuitems$.subscribe(data => {
    console.info('data from server:', data);
  });
  

  this.cartCountSubscription = this.cartStore.getCartCount$.subscribe(
    count => this.itemCount = count
  );
  this.cartStore.totalPrice$.subscribe(totalPrice=>
    this.total = totalPrice
  )
  this.cartStore.loadAllItems();

}
ngOnDestroy(): void {
  this.cartCountSubscription.unsubscribe()
}
invalid(){
  return this.itemCount<= 0
}
id!: string
name!:string
price!:number
quantity!:number


addToOrder(item:menuitems){
  this.cartStore.addToCart(item)
}
removeFromOrder(id:string){
  this.cartStore.removeFromCart(id);
}
orderId!:number
process(){
  this.router.navigate(['/place-order'])
}

}
