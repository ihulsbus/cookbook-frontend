export interface User {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  groups?: string[]; // Authentik group membership, e.g. "cookbook-admin"
  [key: string]: any;
}
