import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/user-profile.model';
import { UpdateProfileRequest } from '../../../models/update-profile-request.model';
import { TopicService } from '../../../services/topic.service';
import { AuthService } from '../../../services/auth.service';
import { Topic } from '../../../models/topic.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;
  subscriptions: Topic[] = [];
  isLoadingProfile = true;
  isLoadingSubscriptions = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private topicService: TopicService,
    private authService: AuthService,
    private location: Location
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserSubscriptions();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$')]]
    });
  }

  loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.errorMessage = '';
    
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          password: ''
        });
        this.isLoadingProfile = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil';
        console.error('Error loading profile:', error);
        this.isLoadingProfile = false;
      }
    });
  }

  loadUserSubscriptions(): void {
    this.isLoadingSubscriptions = true;
    
    this.topicService.getUserSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoadingSubscriptions = false;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.isLoadingSubscriptions = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.profileForm.value;
    const updateRequest: UpdateProfileRequest = {
      username: formValue.username,
      email: formValue.email
    };

    // Only include password if it's provided
    if (formValue.password && formValue.password.trim()) {
      updateRequest.password = formValue.password;
    }

    this.userService.updateUserProfile(updateRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Profil mis à jour avec succès!';
        // Update auth service stored user
        this.authService.updateStoredUser({
          username: updateRequest.username,
          email: updateRequest.email
        });
        // Clear password field
        this.profileForm.patchValue({ password: '' });
        this.isSubmitting = false;
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
        }
        console.error('Error updating profile:', error);
        this.isSubmitting = false;
      }
    });
  }

  unsubscribeFromTopic(topicId: number): void {
    this.topicService.unsubscribeTopic(topicId).subscribe({
      next: () => {
        this.subscriptions = this.subscriptions.filter(topic => topic.id !== topicId);
      },
      error: (error) => {
        console.error('Error unsubscribing from topic:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'username' ? 'Le nom d\'utilisateur' : fieldName === 'email' ? 'L\'email' : 'Le mot de passe'} est requis`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName === 'username' ? 'Le nom d\'utilisateur' : 'Le mot de passe'} doit contenir au moins ${requiredLength} caractères`;
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `${fieldName === 'username' ? 'Le nom d\'utilisateur' : 'L\'email'} doit contenir au maximum ${requiredLength} caractères`;
      }
      if (field.errors['email']) {
        return 'L\'email doit être valide';
      }
      if (field.errors['pattern']) {
        return 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
      }
    }
    return '';
  }
}
