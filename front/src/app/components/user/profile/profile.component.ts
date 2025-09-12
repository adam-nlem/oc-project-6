import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to view your profile';
      this.router.navigate(['/login']);
    }
    
    this.isLoading = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }
}
