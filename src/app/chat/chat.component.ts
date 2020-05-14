import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BaseComponent } from '../common/base-component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { LocationService } from '../services/location.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastaService, ToastaConfig, ToastOptions } from 'ngx-toasta';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { element } from 'protractor';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  source$: Observable<any>;
  friend;
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
    this.source$ = this.cs.get(this.chatId);
    this.source$.subscribe(val => {
      this.getData(val);
    })
    //this.setSourceReadable(this.source);
    console.log("komunikat", this.source$);
    this.scrollToBottom();
  }

  getData(val) {
    let id;
    
    if (val.user1 === this.profile.id) {
      id = val.user2;
    } else {
      id = val.user1;
    }

    if (id) {
      this.auth.downloadSpecificUser(id).then(data => {
        if (data) {
          this.friend = data;
          console.log(this.friend);
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  addEmoji(event: any) {
    if (this.newMsg) {
      this.newMsg += event.emoji.native;
    } else {
      this.newMsg = event.emoji.native;
    }
  }

  submit() {
    if (this.newMsg !== '') {
      this.cs.sendMessage(this.chatId, this.newMsg, this.profile);
      this.newMsg = '';
    }
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

  deleteMsg(msg, source) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: "Czy na pewno chcesz usunąć tą wiadomość? <br> <i>Treść wiadomości zostanie usunięta dla ciebie i znajomego</i>"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cs.updateMessage(msg, this.chatId, source);
      }
    });
  }
}