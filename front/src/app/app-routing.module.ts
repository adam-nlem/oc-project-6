import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Page components
import { MainLayoutComponent } from './pages/layout/main-layout/main-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { MainComponent } from './pages/auth/main/main.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { ProfilePageComponent } from './pages/user/profile-page/profile-page.component';
import { ProfileEditPageComponent } from './pages/user/profile-edit-page/profile-edit-page.component';
import { TopicListPageComponent } from './pages/topic/topic-list-page/topic-list-page.component';
import { TopicSubscriptionPageComponent } from './pages/topic/topic-subscription-page/topic-subscription-page.component';

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
      { path: 'home', component: DashboardComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'profile/edit', component: ProfileEditPageComponent },
      { path: 'topics', component: TopicListPageComponent },
      { path: 'subscriptions', component: TopicSubscriptionPageComponent },
      { path: 'articles', component: HomeComponent } // Temporary until we create the articles component
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
