export enum APIStatus {
  Success,
  BadRequest,
  Unauthorized,
  ServerError,
}
export interface AuthFormProps {
  title: string;
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
  actionLabel: string;
  navigateLabel: string;
  onNavigate: () => void;
}

export interface PageProps {
  navigateToMainPage(): void;
  navigateToSignUpPage(): void;
  navigateToLoginPage(): void;
}

export interface TicketCategory {
  name: string;
  price: number;
  quantityAvailable: number;
  quantityReserved: number;
  quantitySold: number;
  _id: string;
}

export interface EventsResponse {
  total: number;
  page: number;
  size: number;
  data: Event[];
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  min_price: number;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  ticketCategories: TicketCategory[];
  comments: Comment[];
}
export interface Comment {
  _id: string;
  username?: string;
  content: string;
  date: string;
  user: string;
}

export interface TicketCategory {
  name: string;
  price: number;
  quantityAvailable: number;
  quantityReserved: number;
  quantitySold: number;
  _id: string;
}

export interface SelectedTicketCounts {
  [categoryId: string]: number;
}

export interface Order {
  _id: string;
  userId: string;
  eventId: string;
  ticketCategory: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface OrderWithEvent extends Order {
  event: Event;
}

export interface CheckoutDetails {
  orderId: string;
  eventId: string;
  eventName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  pricePerTicket: number;
}

export interface CheckoutPageProps {
  checkoutDetails: CheckoutDetails;
}



export interface EventData {
  name: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  organizer: string;
  location: string;
  image: string;
  ticketCategories: TicketCategory[];
  comments: any[]; // Define more specifically if possible
}