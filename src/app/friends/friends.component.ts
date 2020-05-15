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
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent extends BaseComponent implements OnInit {

  dataRecived = false;
  userList = [];
  displayedColumns: string[] = ['photoDownloadURL', 'username', 'bio', 'options'];
  dataSource: MatTableDataSource<Array<UserModel>>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
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
    setTimeout(() => {
      this.getMyFriends(this.profile);
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.userList);
        if (this.dataSource) {
          this.dataSource.sort = this.sort;
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataRecived = true;
        }
      }, 500)
    }, 2500);
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: "Czy na pewno chcesz usunąć użytkownika <b>" + element.username + "</b>?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newMyFriendsList = this.profile.friendsList.filter(obj => obj.id !== element.id);
        this.afs.doc(`users/${this.profile.id}`).update({ friendsList: newMyFriendsList });

        let newFriendsList = element.friendsList.filter(obj => obj.id !== this.profile.id);
        this.afs.doc(`users/${element.id}`).update({ friendsList: newFriendsList });

        let newUsersList = this.userList.filter(obj => obj != element);
        this.dataSource = new MatTableDataSource(newUsersList);
        this.dataSource.sort = this.sort;
        setTimeout(() => this.dataSource.paginator = this.paginator);

        let roomID;
        this.profile.friendsList.forEach(user => {
          if (user.id === element.id) {
            roomID = user.room;
          }
        });

        this.afs.doc(`chats/${roomID}`).delete();


        var toastOptions: ToastOptions = {
          title: "Usunięto użytkownika ze znajomych",
          msg: "Usunięty użytkownik: " + element.username,
          showClose: true,
          timeout: 5000,
          theme: 'bootstrap',
        }
        this.toastaService.info(toastOptions);
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMyFriends(user) {
    if (user.friendsList.length !== 0) {
      user.friendsList.forEach(element => {
        this.auth.downloadSpecificUser(element.id).then(data => {
          if (data) {
            this.userList.push(data);
          }
        });
      });
    }
  }

  navigateToChat(element) {
    let roomID;
    this.profile.friendsList.forEach(user => {
      if (user.id === element.id) {
        roomID = user.room;
      }
    });
    if (roomID) {
      this.router.navigate(['chats/'+roomID]);
    }
  }

}
