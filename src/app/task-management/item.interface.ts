export interface Category {
  categoryName: string;
  backgroundColor: string;
}

export interface Item {
  _id?: string; // optional
  text: string;
  category: Category;
}
