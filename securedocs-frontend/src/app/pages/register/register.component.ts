import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form = {
    username: '',
    email: '',
    password: ''
  };

  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async submit(): Promise<void> {
    this.error = '';

    try {
      await this.authService.register(this.form);
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Registration failed';
    }
  }
}