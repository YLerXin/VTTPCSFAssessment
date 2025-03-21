import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartStore } from '../restaurantStore';
import { menuitems, Order } from '../models';
import { Observable, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-place-order',
  standalone: false,
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent implements OnInit{
  private router = inject(Router)
  private cartStore = inject(CartStore)
  // TODO: Task 3
  protected items$!:Observable<menuitems[]>
  protected allitems:menuitems[] = []
  totalPrice$!: Observable<number>
  private fb = inject(FormBuilder)
  form!:FormGroup
  private resSvc = inject(RestaurantService)


  ngOnInit(): void {
    this.items$ = this.cartStore.items$
    this.totalPrice$ = this.cartStore.totalPrice$
    this.cartStore.loadAllItems();
    this.form = this.fb.group({
      username:this.fb.control<string>('',[Validators.required]),
      password:this.fb.control<string>('',[Validators.required])
    })
  }
  startover(){
    this.cartStore.clearCart();
    this.router.navigate(['**'])
  }
  invalid(){
    return this.form.invalid
  }

  process(){
    const username = this.form.value.username
    const password = this.form.value.password

    this.items$.pipe(take(1))
      .subscribe(items => {
        const order: Order = {
          username: username,
          password: password,
          items: items.map(i => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity
          }))
        };

        this.resSvc.postFoodOrder(order)
          .subscribe({
            next: (resp) => {
              console.log('Server response:', resp);
              this.cartStore.clearCart();
              
              this.router.navigate(['/confirm'],{
                queryParams: {
                  orderId: resp.orderId,
                  paymentId: resp.paymentId,
                  total: resp.total,
                  timestamp: resp.timestamp
                }
              });
            },
            error: (err) => {
              console.error('Error placing order:', err);
              alert( `${err.error?.message || err.message}`)
            }
          });
      });
  }
}
