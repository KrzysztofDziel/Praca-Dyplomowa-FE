import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../common/base-component';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions } from 'ngx-toasta';
import { UserModel } from '../models/user';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Invitation } from '../models/invitation';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})

export class SearchUsersComponent extends BaseComponent implements OnInit {
  invitationsList = [];
  dataRecived = false;
  userList = null;
  inviteMessage = '';
  displayedColumns: string[] = ['photoDownloadURL', 'username', 'bio', 'options'];
  dataSource: MatTableDataSource<Array<UserModel>>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private loc: LocationService,
    private afs: AngularFirestore,
    auth: AuthService,
    toastaService: ToastaService,
    toastaConfig: ToastaConfig) {
    super(loc, auth, toastaService, toastaConfig);
    this.toastaConfig.theme = 'material';
  }

  ngOnInit() {
    setTimeout(() => {
      this.userList = this.auth.getUsersInYourCity(this.locationModel, this.profile.id);
      console.log(this.userList);
      setTimeout(() => {
        this.downloadSentInvitations();
        setTimeout(() => {
          this.checkWhoIsInvitedByMe();
          console.log(this.userList);
          this.dataSource = new MatTableDataSource(this.userList);
          if (this.dataSource) {
            this.dataSource.sort = this.sort;
            setTimeout(() => this.dataSource.paginator = this.paginator);
            this.dataRecived = true;
            console.log(this.dataSource);
          }
        }, 500)
      }, 1000);
    }, 3000);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sendInvite(element) {

    const newUID = this.afs.createId();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`invitations/${newUID}`);

    var toastOptions: ToastOptions = {
      title: "Wysłano zaproszenie użytkownikowi - " + element.username,
      msg: "Treść: " + this.inviteMessage,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    var toastOptionsError: ToastOptions = {
      title: "Wystapił nieoczekiwany błąd",
      msg: "Nie udało się wysłać zaproszenia użytkownikowi: " + element.username,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    const invitationData: Invitation = {
      invitationFrom: this.profile.id,
      message: this.inviteMessage,
      invitationTo: element.id,
      invitationFromUsername: this.profile.username,
      invitationFromBio: this.profile.bio,
      invitationFromPhotoDownloadURL: this.profile.photoDownloadURL
    }

    try {
      element.isInvited = true;
      userRef.set(invitationData, {
        merge: true
      })
      this.toastaService.success(toastOptions);
    } catch (e) {
      console.log(e);
      this.toastaService.error(toastOptionsError);
    }


  }

  downloadSentInvitations() {
    return this.afs.collection('invitations', ref => ref
      .where('invitationFrom', '==', this.profile.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          if (doc.data().invitationTo !== undefined) {
            let invitationTo = doc.data().invitationTo;
            this.invitationsList.push(invitationTo);
          }
        })
        console.log(this.invitationsList);
      });
  }

  checkWhoIsInvitedByMe() {
    if (this.invitationsList.length !== 0) {
      let newUserList = [];
      this.userList.forEach(user => {
        let item = {
          username: user.username,
          email: user.email,
          bio: user.bio,
          photoURL: user.photoURL,
          country: user.country,
          region: user.region,
          city: user.city,
          id: user.id,
          emailVerified: user.emailVerified,
          photoDownloadURL: user.photoDownloadURL,
          isInvited: false
        };

        this.invitationsList.forEach(personInvited => {
          if (user.id === personInvited) {
            item = {
              username: user.username,
              email: user.email,
              bio: user.bio,
              photoURL: user.photoURL,
              country: user.country,
              region: user.region,
              city: user.city,
              id: user.id,
              emailVerified: user.emailVerified,
              photoDownloadURL: user.photoDownloadURL,
              isInvited: true
            };
          }
        })
        newUserList.push(item);
      });
      this.userList = [];
      this.userList = newUserList;
    }
  }


  addEmoji(event: any) {
    this.inviteMessage += event.emoji.native;
  }

}
