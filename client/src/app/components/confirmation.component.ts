import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-confirmation',
  standalone: false,
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{

  // TODO: Task 5
  orderId!:String;
  paymentId!:string;
  date!:string;
  total!:number
  private router = inject(Router)
  private resSvc = inject(RestaurantService)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.route.queryParams.subscribe(qp => {
      this.orderId = qp['orderId'];
      this.paymentId = qp['paymentId'];
      this.total = +qp['total']; 
      const ts = qp['timestamp'];
      if (ts) {
        const d = new Date(+ts);
        this.date = d.toDateString();
      }
    });
  }

  return(){
    this.router.navigate(['**'])
  }
}

