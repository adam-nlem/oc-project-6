import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  isLoading = false;
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/posts']);
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
