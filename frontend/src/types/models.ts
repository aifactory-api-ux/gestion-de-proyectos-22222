export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "viewer";
  is_active: boolean;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget: number;
  executed: number;
  forecast: number;
  status: "on_track" | "at_risk" | "delayed" | "completed";
  manager_id: number;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget: number;
  manager_id: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  executed?: number;
  forecast?: number;
  status?: "on_track" | "at_risk" | "delayed" | "completed";
  manager_id?: number;
}

export interface KPI {
  total_budget: number;
  total_executed: number;
  total_deviation: number;
  total_forecast: number;
}

export interface TrendPoint {
  date: string;
  planned: number;
  executed: number;
}

export interface Notification {
  id: number;
  type: "budget_deviation" | "milestone" | "forecast_change" | "ai_message";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  user_id: number;
}

export interface NotificationCreate {
  type: "budget_deviation" | "milestone" | "forecast_change" | "ai_message";
  title: string;
  message: string;
  user_id: number;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
  project_id?: number;
}

export interface ChatMessageCreate {
  message: string;
  project_id?: number;
}