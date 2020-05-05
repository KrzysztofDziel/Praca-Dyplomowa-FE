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
      console.log(this.myInvitations);
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.myInvitations);
        if (this.dataSource) {
          this.dataSource.sort = this.sort;
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataRecived = true;
          console.log(this.dataSource);
        }
      }, 1000);
    }, 3000);
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
  }

  rejectInvitation(element) {
    this.myInvitations = this.myInvitations.filter(obj => obj !== element);
    this.dataSource = new MatTableDataSource(this.myInvitations);
    this.dataSource.sort = this.sort;
    setTimeout(() => this.dataSource.paginator = this.paginator);
    this.deleteInvitation(element);
  }

  addUserToFriends() {

  }

  deleteInvitation(element) {
    var toastOptions: ToastOptions = {
      title: "Odrzucono zaproszenie do znajomych",
      msg: "Odrzucony użytkownik: " + element.username,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

    this.afs.doc(`invitations/${element.docId}`).delete().then( () => {
      this.toastaService.info(toastOptions);
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

}
