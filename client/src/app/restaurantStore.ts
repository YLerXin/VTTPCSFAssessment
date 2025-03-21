import { inject, Injectable } from "@angular/core";
import { menuitems } from "./models";
import { ComponentStore } from "@ngrx/component-store";
import { CartRepository } from "./restaurantRepo";
import { catchError, concatMap, EMPTY, from, mergeMap, tap } from "rxjs";

export interface CartSlice{
    items:menuitems[];
    totalQuantity:number;
    totalPrice:number;
}

const INIT: CartSlice={
    items:[],
    totalQuantity:0,
    totalPrice:0
}

@Injectable()
export class CartStore extends ComponentStore<CartSlice>{
    private cartRepo = inject(CartRepository);

    constructor(){
        super(INIT);
    }

    private computeTotals(items:menuitems[]){
        const totalQuantity = items.reduce((acc,item)=>acc + item.quantity,0)

        const totalPrice = items.reduce((acc,items)=>acc+items.price*items.quantity,0)

        return {totalQuantity,totalPrice};
    }


    readonly removeItem = this.updater<string>((state,id)=>{
        const updatedItems = state.items.filter(i=>i.id!==id); //keep only those items whose prodId does not match the given prodId
        const {totalQuantity,totalPrice} = this.computeTotals(updatedItems);

        return {
            ...state,
            items:updatedItems,
            totalQuantity,
            totalPrice
        }
    })

    readonly removeFromCart = this.effect<string>((prodIdToRemove$)=>
        prodIdToRemove$.pipe(
            concatMap((id)=>
            from(this.cartRepo.removemenuitem(id)).pipe(
                tap((removedId)=>this.removeItem(removedId)),
                catchError(()=>EMPTY)
            ))
        ))

    readonly loadAllItems = this.effect<void>((trigger$)=>
        trigger$.pipe(
            mergeMap(()=>
            from(this.cartRepo.getAllItem()).pipe(
                tap((items)=>{
                    const {totalQuantity,totalPrice} = this.computeTotals(items);
                    this.patchState({
                        items,
                        totalQuantity,
                        totalPrice
                    })
                }),
                catchError(()=>EMPTY)
            ))
        ))

    readonly getCartCount$ = this.select<number>(
        (slice:CartSlice) => slice.items.length
    )

    readonly items$ = this.select((s)=>s.items);
    readonly totalQuantity$ = this.select((s) => s.totalQuantity);
    readonly totalPrice$ = this.select((s) => s.totalPrice);

    readonly clearCart = this.effect<void>((trigger$) =>
        trigger$.pipe(
          mergeMap(() =>
            from(this.cartRepo.clearAllItems()).pipe( 
              tap(() => {
                this.patchState({
                  items: [],
                  totalQuantity: 0,
                  totalPrice: 0
                });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      );

      readonly addToCart = this.effect<menuitems>((itemToAdd$) =>
        itemToAdd$.pipe(
          mergeMap((item) =>
            from(this.cartRepo.getItemById(item.id)).pipe(
              mergeMap((existingItem) => {
                if (!existingItem) {
                  const newItem = { ...item, quantity: 1 }
                  return from(this.cartRepo.addmenuitem(newItem)).pipe(
                    tap((savedItem) => this.addItem(savedItem)),
                    catchError(() => EMPTY)
                  );
                } else {
                  const updated = { 
                    ...existingItem, 
                    quantity: existingItem.quantity + 1 
                  };
                  return from(this.cartRepo.addmenuitem(updated)).pipe(
                    tap((savedItem) => this.addItem(savedItem)),
                    catchError(() => EMPTY)
                  );
                }
              }),
              catchError(() => EMPTY)
            )
          )
        )
      );
      readonly addItem = this.updater<menuitems>((state, newItem) => {
        const idx = state.items.findIndex(i => i.id === newItem.id);
        let updatedItems: menuitems[];
      
        if (idx < 0) {
          updatedItems = [...state.items, newItem];
        } else {
          const existing = state.items[idx];
          const merged = { ...existing, quantity: newItem.quantity };
          updatedItems = state.items.map((i, j) => j === idx ? merged : i);
        }
      
        const { totalQuantity, totalPrice } = this.computeTotals(updatedItems);
        return {
          ...state,
          items: updatedItems,
          totalQuantity,
          totalPrice
        };
      });
      
}