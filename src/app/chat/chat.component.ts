import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BaseComponent } from '../common/base-component';
import { MatDialog } from '@angular/material';
import { LocationService } from '../services/location.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastaService, ToastaConfig } from 'ngx-toasta';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent implements OnInit {
  source: Observable<any>;
  newMsg: string;
  chatId: string;
  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loc: LocationService,
    private afs: AngularFirestore,
    private router: Router,
    auth: AuthService,
    toastaService: ToastaService,
    toastaConfig: ToastaConfig) {
    super(loc, auth, toastaService, toastaConfig);
    this.toastaConfig.theme = 'material';
  }


  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id');
    this.source = this.cs.get(this.chatId);
    //this.setSourceReadable(this.source);
    console.log(this.source);
  }

  submit() {
    this.cs.sendMessage(this.chatId, this.newMsg, this.profile.id);
    this.newMsg = '';
  }

  setSourceReadable(src) {
    src.docs.forEach(doc => {
      const item = {
        id: doc.data().invitationFrom,
        docId: doc.id,
        username: doc.data().invitationFromUsername,
        bio: doc.data().invitationFromBio,
        photoDownloadURL: doc.data().invitationFromPhotoDownloadURL,
        message: doc.data().message
      };

    })

  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }
}