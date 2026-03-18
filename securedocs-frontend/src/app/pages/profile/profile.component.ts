import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  error = '';

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.authService.getProfile();
      this.profile = response.user;
    } catch (err: any) {
      this.error = err?.error?.message || 'Failed to load profile';
    }
  }
}