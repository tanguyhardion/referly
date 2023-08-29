import { Item } from "./item";

export class SubCategory {
    name: string;
    items: Item[];
    
    constructor(name: string, items: Item[]) {
        this.name = name;
        this.items = items;
    }
}