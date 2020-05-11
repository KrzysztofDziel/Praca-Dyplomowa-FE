import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { UserInformationPanelComponent } from './user-information-panel/user-information-panel.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import {ToastaModule} from 'ngx-toasta';
import { AvatarModule } from 'ngx-avatar';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { ActiveInvitationsComponent } from './active-invitations/active-invitations.component';
import { FriendsComponent } from './friends/friends.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    UserInformationPanelComponent,
    HomePageComponent,
    SignInComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    VerifyEmailComponent,
    SettingsPageComponent,
    SearchUsersComponent,
    ActiveInvitationsComponent,
    FriendsComponent,
    ConfirmationDialogComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    PickerModule,
    AvatarModule,
    ToastaModule.forRoot(),
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
