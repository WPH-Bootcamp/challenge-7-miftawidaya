/**
 * Auth Types
 * @description Types for authentication and user profile.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export type LoginInput = Pick<User, 'email'> & { password: string };

export interface RegisterInput extends LoginInput {
  name: string;
  phone: string;
}
