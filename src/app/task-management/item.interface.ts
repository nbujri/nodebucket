/**
 * title: item.interface.ts
 * author: ngi bujri
 * date: august 23 2023
 * description: item interface
 */

export interface Category {
  categoryName: string;
  backgroundColor: string;
}

export interface Item {
  _id?: string; // optional
  text: string;
  category: Category;
}
