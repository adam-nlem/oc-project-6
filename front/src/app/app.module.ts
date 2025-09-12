import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ProfileEditComponent } from './components/user/profile-edit/profile-edit.component';
import { TopicListComponent } from './components/topic/topic-list/topic-list.component';
import { TopicSubscriptionComponent } from './components/topic/topic-subscription/topic-subscription.component';

// Services and Interceptors
import { TokenInterceptor } from './services/token.interceptor';
import { AuthService } from './services/auth.service';

// Page Components
import { MainLayoutComponent } from './pages/layout/main-layout/main-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { ProfilePageComponent } from './pages/user/profile-page/profile-page.component';
import { ProfileEditPageComponent } from './pages/user/profile-edit-page/profile-edit-page.component';
import { TopicListPageComponent } from './pages/topic/topic-list-page/topic-list-page.component';
import { TopicSubscriptionPageComponent } from './pages/topic/topic-subscription-page/topic-subscription-page.component';
import { MainComponent } from './pages/auth/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ProfileEditComponent,
    TopicListComponent,
    TopicSubscriptionComponent,
    // Page Components
    MainLayoutComponent,
    LoginPageComponent,
    RegisterPageComponent,
    DashboardComponent,
    ProfilePageComponent,
    ProfileEditPageComponent,
    TopicListPageComponent,
    TopicSubscriptionPageComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
