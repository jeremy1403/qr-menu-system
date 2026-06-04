export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { menuItems: number };
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface MenuItemIngredient {
  ingredientId: string;
  ingredient: Ingredient;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
  categoryId: string;
  category: Category;
  ingredients: MenuItemIngredient[];
}