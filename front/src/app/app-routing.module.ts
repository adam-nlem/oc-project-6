import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Page components
import { MainLayoutComponent } from './pages/layout/main-layout/main-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { MainComponent } from './pages/auth/main/main.component';
import { ProfilePageComponent } from './pages/user/profile-page/profile-page.component';
import { ProfileEditPageComponent } from './pages/user/profile-edit-page/profile-edit-page.component';
import { TopicListPageComponent } from './pages/topic/topic-list-page/topic-list-page.component';
import { PostListComponent } from './pages/post/post-list/post-list.component';
import { PostDetailComponent } from './pages/post/post-detail/post-detail.component';
import { PostCreatePageComponent } from './pages/post/post-create-page/post-create-page.component';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },


  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent }
  ,
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'profile', component: ProfilePageComponent },
      { path: 'profile/edit', component: ProfileEditPageComponent },
      { path: 'topics', component: TopicListPageComponent },
      { path: 'posts', component: PostListComponent },
      { path: 'posts/create', component: PostCreatePageComponent },
      { path: 'posts/:id', component: PostDetailComponent },
      { path: 'articles', redirectTo: '/posts', pathMatch: 'full' },
      { path: 'articles/:id', redirectTo: '/posts/:id' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
