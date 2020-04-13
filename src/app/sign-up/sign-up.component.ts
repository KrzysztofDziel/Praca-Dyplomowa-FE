import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  userName: string;
  password: string;
  emailAddress: string;
  bio: string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.bio = "";
  }

  addEmoji(event: any) {
    this.bio += event.emoji.native;
  }

}
