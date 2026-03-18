import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form = {
    identifier: '',
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
      await this.authService.login(this.form);
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Login failed';
    }
  }
}