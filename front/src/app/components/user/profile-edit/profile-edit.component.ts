import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.initForm();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to edit your profile';
      this.router.navigate(['/login']);
    }
    
    this.isLoading = false;
  }

  initForm(): void {
    if (this.currentUser) {
      this.profileForm = this.formBuilder.group({
        username: [this.currentUser.username, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: [this.currentUser.email, [Validators.required, Validators.email]],
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.pattern(this.passwordPattern)]],
        confirmPassword: ['']
      }, {
        validators: this.passwordMatchValidator
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    // Here you would call your API service to update the user profile
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      this.successMessage = 'Profile updated successfully';
      this.isLoading = false;
      
      // Update the stored user data
      if (this.currentUser) {
        this.currentUser.username = this.profileForm.value.username;
        this.currentUser.email = this.profileForm.value.email;
        
        // Update the stored user in the auth service
        this.authService.updateStoredUser(this.currentUser);
      }
      
      // Navigate back to profile after a delay
      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 1500);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
