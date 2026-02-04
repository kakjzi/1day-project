// src/types/index.ts

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'COMPLETED';

export interface AuthState {
  token: string | null;
  tableNumber: number | null;
  isAuthenticated: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: number;
  category_name: string;
  is_sold_out: boolean;
}

export interface Option {
  id: number;
  name: string;
  price: number;
}

export interface OptionGroup {
  id: number;
  name: string;
  is_required: boolean;
  max_select: number;
  options: Option[];
}

export interface MenuDetail extends Menu {
  option_groups: OptionGroup[];
}

export interface SelectedOption {
  optionGroupId: number;
  optionGroupName: string;
  optionId: number;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuId: number;
  menuName: string;
  menuImage: string | null;
  basePrice: number;
  quantity: number;
  selectedOptions: SelectedOption[];
  itemTotal: number;
}

export interface OrderItemOption {
  option_id: number;
  option_name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: OrderItemOption[];
}

export interface Order {
  id: number;
  display_number: string;
  table_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}
