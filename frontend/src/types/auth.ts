export interface User {
  id: string;
  username: string;
  purpose: Purpose;
}

export type Purpose = 'testing' | 'development' | 'production' | 'learning';