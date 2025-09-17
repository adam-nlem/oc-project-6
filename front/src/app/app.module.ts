import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { ProfileComponent } from './components/user/profile/profile.component';
import { ProfileEditComponent } from './components/user/profile-edit/profile-edit.component';

// Services and Interceptors
import { TokenInterceptor } from './services/token.interceptor';
import { AuthService } from './services/auth.service';

// Page Components
import { MainLayoutComponent } from './pages/layout/main-layout/main-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { ProfilePageComponent } from './pages/user/profile-page/profile-page.component';
import { ProfileEditPageComponent } from './pages/user/profile-edit-page/profile-edit-page.component';
import { TopicListPageComponent } from './pages/topic/topic-list-page/topic-list-page.component';
import { MainComponent } from './pages/auth/main/main.component';
import { PostListComponent } from './pages/post/post-list/post-list.component';
import { TopicItemComponent } from './components/topic/topic-item/topic-item.component';
import { PostItemComponent } from './components/post/post-item/post-item.component';
import { PostDetailComponent } from './pages/post/post-detail/post-detail.component';
import { PostCreatePageComponent } from './pages/post/post-create-page/post-create-page.component';
import { CommentItemComponent } from './components/comment/comment-item/comment-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ProfileEditComponent,
    // Page Components
    MainLayoutComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    ProfileEditPageComponent,
    TopicListPageComponent,
    MainComponent,
    PostListComponent,
    TopicItemComponent,
    PostItemComponent,
    PostDetailComponent,
    PostCreatePageComponent,
    CommentItemComponent,
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
    RouterModule,
    MatSelectModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
