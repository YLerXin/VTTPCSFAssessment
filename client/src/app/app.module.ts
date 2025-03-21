import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu.component';
import { PlaceOrderComponent } from './components/place-order.component';

import { ConfirmationComponent } from './components/confirmation.component';

import {RouterModule, Routes} from '@angular/router';
import { RestaurantService } from './restaurant.service';
import { CartStore } from './restaurantStore';
import { CartRepository } from './restaurantRepo';

const appRoutes:Routes = [
  {path:'',component:MenuComponent},
  {path:'place-order',component:PlaceOrderComponent},
  {path:'confirm',component:ConfirmationComponent},

  {path:'**',redirectTo: '/',pathMatch:'full'}

]

@NgModule({
  declarations: [
    AppComponent, MenuComponent, PlaceOrderComponent, ConfirmationComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,
    RouterModule.forRoot(appRoutes,{useHash:true})

  ],
  providers: [ provideHttpClient(),RestaurantService,CartStore,CartRepository ],
  bootstrap: [AppComponent]
})
export class AppModule { }
