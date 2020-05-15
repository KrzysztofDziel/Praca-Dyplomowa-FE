import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../common/base-component';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../models/user';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LocationService } from '../services/location.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions } from 'ngx-toasta';

@Component({
  selector: 'app-active-invitations',
  templateUrl: './active-invitations.component.html',
  styleUrls: ['./active-invitations.component.scss']
})
export class ActiveInvitationsComponent extends BaseComponent implements OnInit {

  dataRecived = false;
  myInvitations = [];
  displayedColumns: string[] = ['photoDownloadURL', 'username', 'bio', 'message', 'options'];
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
      this.downloadSentInvitations();
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.myInvitations);
        if (this.dataSource) {
          this.dataSource.sort = this.sort;
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataRecived = true;
        }
      }, 500);
    }, 2500);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadSentInvitations() {
    this.afs.collection('invitations', ref => ref
      .where('invitationTo', '==', this.profile.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          const item = {
            id: doc.data().invitationFrom,
            docId: doc.id,
            username: doc.data().invitationFromUsername,
            bio: doc.data().invitationFromBio,
            photoDownloadURL: doc.data().invitationFromPhotoDownloadURL,
            message: doc.data().message
          };
          this.myInvitations.push(item);
        })
      });
  }

  acceptInvitation(element) {
    this.myInvitations = this.myInvitations.filter(obj => obj !== element);
    this.dataSource = new MatTableDataSource(this.myInvitations);
    this.dataSource.sort = this.sort;
    setTimeout(() => this.dataSource.paginator = this.paginator);

    var toastOptions: ToastOptions = {
      title: "Dodano użytkownika do znajomych",
      msg: "Dodany użytkownik: " + element.username,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    this.toastaService.success(toastOptions);
    this.addUserToFriends(element);
  }

  rejectInvitation(element) {
    this.myInvitations = this.myInvitations.filter(obj => obj !== element);
    this.dataSource = new MatTableDataSource(this.myInvitations);
    this.dataSource.sort = this.sort;
    setTimeout(() => this.dataSource.paginator = this.paginator);
    this.deleteInvitation(element);
  }

  addUserToFriends(element) {
    let roomID = this.afs.createId();
    let alreadyFriend = false;
    this.profile.friendsList.forEach(object => {
      if (object.id === element.id) {
        alreadyFriend = true;
      }
    })
    if (alreadyFriend) {
      this.afs.doc(`invitations/${element.docId}`).delete().then(() => {
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    } else {
      this.afs.doc(`invitations/${element.docId}`).delete().then(() => {
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
      let friendModel = { id: element.id, room: roomID};
      this.profile.friendsList.push(friendModel);
      this.afs.doc(`users/${this.profile.id}`).update({ friendsList: this.profile.friendsList });
      let newFriend = new UserModel;
      this.auth.downloadSpecificUser(element.id).then(data => {
        if (data) {
          newFriend = data;
          let alreadyInFriends = false;
          newFriend.friendsList.forEach(element => {
            if (element.id === this.profile.id) {
              alreadyInFriends = true;
            }
          });

          if (!alreadyInFriends) {
            let newFriendModel = { id: this.profile.id, room: roomID};
            newFriend.friendsList.push(newFriendModel);
            this.afs.doc(`users/${element.id}`).update({ friendsList: newFriend.friendsList });
            this.auth.createRoom(roomID, this.profile.id, element.id);
          }
        }
      });

      this.afs.collection('invitations', ref => ref
        .where('invitationTo', '==', element.id)
        .where('invitationFrom', '==', this.profile.id))
        .get().subscribe(val => {
          val.docs.forEach(doc => {
            const item = {
              id: doc.data().invitationFrom,
              docId: doc.id,
              username: doc.data().invitationFromUsername,
              bio: doc.data().invitationFromBio,
              photoDownloadURL: doc.data().invitationFromPhotoDownloadURL,
              message: doc.data().message
            };
            this.afs.doc(`invitations/${item.docId}`).delete();
          })
        });

    }
  }

  deleteInvitation(element) {
    var toastOptions: ToastOptions = {
      title: "Odrzucono zaproszenie do znajomych",
      msg: "Odrzucony użytkownik: " + element.username,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    this.afs.doc(`invitations/${element.docId}`).delete().then(() => {
      this.toastaService.info(toastOptions);
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

}
