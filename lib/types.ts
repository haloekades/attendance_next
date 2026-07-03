export type Role = "admin" | "employee";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: Role;
  job: string | null;
  department: string | null;
  age: number | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  employee: Employee;
}

export interface Attendance {
  id: number;
  clockIn: string;
  clockOut: string | null;
  employee: Employee;
  employeeId: number;
  createdAt: string;
  updatedAt: string;
}
