import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { UserInformationPanelComponent } from './user-information-panel/user-information-panel.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './services/guard/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SecureInnerPagesGuard } from './services/guard/secure-inner-pages.guard.ts.guard';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { SearchUsersComponent } from './search-users/search-users.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'account-info', component: UserInformationPanelComponent, canActivate: [AuthGuard] },
  { path: 'account-settings', component: SettingsPageComponent, canActivate: [AuthGuard] },
  { path: 'search-city', component: SearchUsersComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { 

}
