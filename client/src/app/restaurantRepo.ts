import { Injectable } from "@angular/core";
import Dexie, {Table} from "dexie";
import { menuitems } from "./models";

@Injectable()
export class CartRepository extends Dexie{
    cartTable!:Table<menuitems,string>

    constructor(){
        super('cartdb')

        this.version(1).stores({
            cart:'id'
        })
        this.cartTable = this.table('cart')
    }


    addmenuitem(item:menuitems):Promise<menuitems>{
        return this.cartTable.put(item)
        .then(()=>item);
    }

    removemenuitem(id:string):Promise<string>{
        return this.cartTable.delete(id)
        .then(()=>id)
    }

    getAllItem():Promise<menuitems[]>{
        return this.cartTable.toArray();
    }
    clearAllItems():Promise<void>{
        return this.cartTable.clear();
    }
    getItemById(id:string):Promise<menuitems | undefined>{
        return this.cartTable.get(id);
    }

}