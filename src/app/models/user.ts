export interface User {
  sub?: string; // Unique user ID
  name?: string;
  email?: string;
  picture?: string;
  groups?: string[]; // Authentik group membership, e.g. "cookbook-admin"
  [key: string]: any; // For additional claims
}
