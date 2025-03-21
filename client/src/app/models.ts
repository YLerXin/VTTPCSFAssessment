// You may use this file to create any models
export interface menuitems{
    id:string;
    name:string;
    price:number;
    description?:string;
    quantity:number;
}
export interface Cart{
    menuitems:menuitems[]
}

export interface Order{
    username:string;
    password:string;
    items:{
        id:string;
        price:number;
        quantity:number;
    }[]
}