import { SubCategory } from "./sub-category";

export class Node {
    category: string;
    subCategory: SubCategory;

    constructor(category: string, subCategory: SubCategory) {
        this.category = category;
        this.subCategory = subCategory;
    }
}