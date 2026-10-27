export interface User {
  sub?: string; // Unique user ID
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any; // For additional claims
}
