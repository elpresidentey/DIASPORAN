/**
 * Authentication utilities
 * Simple client-side auth for demo purposes
 * Can be easily upgraded to use a real backend API
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const USERS_KEY = 'dettyconnect_users';
const CURRENT_USER_KEY = 'dettyconnect_current_user';

/**
 * Get all users from localStorage
 */
function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

/**
 * Save users to localStorage
 */
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email address' };
  }

  const users = getUsers();

  // Check if user already exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  // Save user
  users.push(newUser);
  saveUsers(users);

  // Store password separately (in real app, this would be hashed on backend)
  localStorage.setItem(`password_${newUser.id}`, password);

  // Set as current user
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

/**
 * Log in an existing user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Check password
  const storedPassword = localStorage.getItem(`password_${user.id}`);
  if (storedPassword !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Set as current user
  setCurrentUser(user);

  return { success: true, user };
}

/**
 * Log out the current user
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Get the current logged-in user
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Set the current user
 */
function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
