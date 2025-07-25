import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Mock users for testing
  private mockUsers: Array<User & { password: string }> = [
    {
      id: '1',
      fullName: 'John Doe',
      email: 'admin@ahon.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'operator@ahon.com',
      password: 'operator123',
      role: 'operator',
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      fullName: 'Test User',
      email: 'test@ahon.com',
      password: 'test123',
      role: 'viewer',
      createdAt: new Date('2024-01-03')
    }
  ];

  constructor() {
    this.loadStoredAuth();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await this.delay(1000);

    const user = this.mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      const token = this.generateMockToken();
      
      this.setAuthenticatedUser(userWithoutPassword, token);
      
      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    // Simulate API delay
    await this.delay(1500);

    // Check if email already exists
    const existingUser = this.mockUsers.find(u => 
      u.email.toLowerCase() === signupData.email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message: 'Email already exists'
      };
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      role: 'viewer', // Default role
      createdAt: new Date()
    };

    this.mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = this.generateMockToken();
    
    this.setAuthenticatedUser(userWithoutPassword, token);

    return {
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
      token
    };
  }

  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearStoredAuth();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Backend integration methods (ready for implementation)
  async loginWithBackend(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        this.setAuthenticatedUser(data.user, data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  async signupWithBackend(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        this.setAuthenticatedUser(data.user, data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Signup API error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  private setAuthenticatedUser(user: User, token: string): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.storeAuth(user, token);
  }

  private storeAuth(user: User, token: string): void {
    try {
      localStorage.setItem('ahon_user', JSON.stringify(user));
      localStorage.setItem('ahon_token', token);
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  }

  private loadStoredAuth(): void {
    try {
      const storedUser = localStorage.getItem('ahon_user');
      const storedToken = localStorage.getItem('ahon_token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      this.clearStoredAuth();
    }
  }

  private clearStoredAuth(): void {
    try {
      localStorage.removeItem('ahon_user');
      localStorage.removeItem('ahon_token');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  private generateMockToken(): string {
    return 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get mock users for testing (remove in production)
  getMockUsers() {
    return this.mockUsers.map(({ password, ...user }) => user);
  }
}
