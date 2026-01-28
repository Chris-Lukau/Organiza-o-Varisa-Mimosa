
export enum Category {
  MOTOR = 'Motor',
  SUSPENSAO = 'Suspensão',
  TRAVOES = 'Travões',
  ILUMINACAO = 'Iluminação',
  INTERIOR = 'Interior',
  CARROCARIA = 'Carroçaria',
  ELETRICA = 'Elétrica'
}

export enum PaymentMethod {
  MCX_EXPRESS = 'Multicaixa Express',
  TRANSFER_IBAN = 'Transferência / IBAN'
}

export enum OrderStatus {
  PENDING = 'Pendente',
  PAID = 'Pago',
  CANCELLED = 'Cancelado',
  SHIPPED = 'Enviado'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  brand: string;
  stock: number;
  minStockThreshold?: number; 
  imageUrl: string;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  paymentReference?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalVisits: number;
  conversionRate: number;
  topProducts: Product[];
  salesByMethod: { [key in PaymentMethod]?: number };
}
