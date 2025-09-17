import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/posts']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la connexion';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
