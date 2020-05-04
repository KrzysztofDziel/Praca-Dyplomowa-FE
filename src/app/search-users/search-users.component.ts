import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../common/base-component';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { ToastaService, ToastaConfig, ToastOptions } from 'ngx-toasta';
import { UserModel } from '../models/user';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})

export class SearchUsersComponent extends BaseComponent implements OnInit {
  dataRecived = false;
  userList = null;
  inviteMessage = '';
  displayedColumns: string[] = ['photoDownloadURL', 'username', 'bio', 'options'];
  dataSource: MatTableDataSource<Array<UserModel>>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private loc: LocationService,
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
        this.dataSource = new MatTableDataSource(this.userList);
        if (this.dataSource) {
          this.dataSource.sort = this.sort;
          setTimeout(() => this.dataSource.paginator = this.paginator);
          this.dataRecived = true;
          console.log(this.dataSource);
        }
      }, 1000);
    }, 2000);
  }

  logData(row) {
    console.log(row);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sendInvite(element) {

    var toastOptions: ToastOptions = {
      title: this.profile.username + " : Wysłano zaproszenie użytkownikowi - " + element.username,
      msg: "ID: " + element.id + " Treść: " + this.inviteMessage,
      showClose: true,
      timeout: 7000,
      theme: 'bootstrap',
    }

      this.toastaService.success(toastOptions);
  }

  addEmoji(event: any) {
    this.inviteMessage += event.emoji.native;
  }

}
