import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { UserModel } from '../models/user';
import { LocationDataModel } from '../models/locationData.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/internal/Observable';
import { finalize, tap } from 'rxjs/operators';
import { firebase } from '@firebase/app';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  userCollectionData: any;
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  peopleCollection: AngularFirestoreCollection;
  foundUsersList = [];

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public dialog: MatDialog,
    public storage: AngularFireStorage,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.auth.useDeviceLanguage();
    this.afAuth.auth.languageCode = 'pl';
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.userData = JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        this.userData = JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  downloadUserById(user) {
    let profile = new UserModel;
    return this.afs.collection('users').doc(user.uid).ref.get().then(function (doc) {
      if (doc.exists) {
        localStorage.setItem('userInformation', JSON.stringify(doc.data()));
        let userInfo = JSON.parse(localStorage.getItem('userInformation'));
        profile.username = userInfo.displayName;
        profile.email = userInfo.email;
        profile.bio = userInfo.bio;
        profile.photoURL = userInfo.photoURL;
        profile.country = userInfo.country;
        profile.region = userInfo.region;
        profile.city = userInfo.city;
        profile.id = userInfo.uid;
        profile.emailVerified = user.emailVerified;
        profile.photoDownloadURL = userInfo.photoDownloadURL;
        profile.friendsList = userInfo.friendsList;
      } else {
        console.log("No such document!");
      }
      return profile;
    }).catch(function (error) {
      console.log("Error getting document:", error);
    })
  }

  downloadSpecificUser(id) {
    let profile = new UserModel;
    return this.afs.collection('users').doc(id).ref.get().then(function (doc) {
      if (doc.exists) {
        profile.username = doc.data().displayName;
        profile.email = doc.data().email;
        profile.bio = doc.data().bio;
        profile.photoURL = doc.data().photoURL;
        profile.country = doc.data().country;
        profile.region = doc.data().region;
        profile.city = doc.data().city;
        profile.id = doc.data().uid;
        profile.emailVerified = doc.data().emailVerified;
        profile.photoDownloadURL = doc.data().photoDownloadURL;
        profile.friendsList = doc.data().friendsList;
      } else {
        console.log("No such document!");
      }
      return profile;
    }).catch(function (error) {
      console.log("Error getting document:", error);
    })
  }


  getDownloadURL(user) {
    if (user.photoURL && user.photoDownloadURL === '') {
      const path = user.photoURL;
      const ref = this.storage.ref(path);
      ref.getDownloadURL().subscribe(url => {
        this.afs.doc(`users/${user.id}`).update({ photoDownloadURL: url });
        user.photoDownloadURL = url;
        localStorage.setItem('userInformation', JSON.stringify(user));
      })
    }
  }

  deleteUserFromDB(user) {
    this.deleteMeFromAllFriens(user);

    this.deleteAllMyChatRooms(user);

    this.deleteInvitations(user);

    this.deleteUserInfo(user);

    this.afAuth.auth.currentUser.delete().then(() => {
      this.SignOut();
    })
  }

  deleteAllMyChatRooms(user) {
    this.afs.collection('chats', ref => ref
      .where('user1', '==', user.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          this.afs.doc(`chats/${doc.id}`).delete();
        })
      });

    this.afs.collection('chats', ref => ref
      .where('user2', '==', user.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          this.afs.doc(`chats/${doc.id}`).delete();
        })
      });
  }

  deleteMeFromAllFriens(user) {
    user.friendsList.forEach(element => {
      this.downloadSpecificUser(element.id).then(specUser => {
        if (specUser) {
          let newFriendsList = specUser.friendsList.filter(obj => obj.id !== user.id);
          this.afs.doc(`users/${specUser.id}`).update({ friendsList: newFriendsList });
        }
      });
    });
  }

  deleteInvitations(user) {
    this.afs.collection('invitations', ref => ref
      .where('invitationTo', '==', user.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          this.afs.doc(`invitations/${doc.id}`).delete();
        })
      });

    this.afs.collection('invitations', ref => ref
      .where('invitationFrom', '==', user.id))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          this.afs.doc(`invitations/${doc.id}`).delete();
        })
      });
  }

  deleteUserInfo(user) {
    if (user.photoDownloadURL != "") {
      this.storage.storage.refFromURL(`${user.photoDownloadURL}`).delete();
    }
    this.afs.doc(`users/${user.id}`).delete().then(function () {
      console.log("Document successfully deleted!", user.id);
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  updateUserBioDatabase(loc: LocationDataModel, user: UserModel) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    userRef.update({ bio: user.bio });
  }

  // Sign in with email/password
  SignIn(email, password) {
    localStorage.removeItem('user');
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.authState.subscribe(user => {
          if (user) {
            this.userData = user;
            localStorage.setItem('user', JSON.stringify(this.userData));
            this.userData = JSON.parse(localStorage.getItem('user'));
          } else {
            localStorage.setItem('user', null);
            this.userData = JSON.parse(localStorage.getItem('user'));
          }
          window.location.reload();
        })
      }).catch((error) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '500px',
          data: error.message
        });
      })
  }


  // Sign up with email/password
  SignUp(email, password, userName, bio) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserDataRegister(result.user, userName, bio);
      }).catch((error) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '500px',
          data: error.message
        });
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '500px',
          data: "Wysłano wiadomość e-mail dotyczącą resetowania hasła, sprawdź skrzynkę odbiorczą."
        });
      }).catch((error) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          width: '500px',
          data: error.message
        });
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  SetUserDataRegister(user, userName, bio) {
    let friendsList: Array<string> = [];
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: userName,
      photoURL: user.photoURL,
      photoDownloadURL: "",
      emailVerified: user.emailVerified,
      city: "",
      country: "",
      region: "",
      bio: bio,
      friendsList: friendsList
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userInformation');
      window.location.reload();
    })
  }

  updateLocationToDB(loc: LocationDataModel, user: UserModel) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    userRef.update({ country: loc.countryName, city: loc.city, region: loc.regionName });

  }

  uploadUserAvatar(file, user) {
    // The storage path
    if (user.photoDownloadURL != "") {
      this.storage.storage.refFromURL(`${user.photoDownloadURL}`).delete();
    }
    const path = `avatars/${Date.now()}_${file.name}`;
    const userId = user.id;
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    this.afs.doc(`users/${user.id}`).update({ photoURL: path, photoDownloadURL: "" });
  }

  deleteUserPhotoFromDB(user) {
    this.storage.storage.refFromURL(`${user.photoDownloadURL}`).delete();
    this.afs.doc(`users/${user.id}`).update({ photoURL: "", photoDownloadURL: "" });
  }

  SetUserMocData(id) {
    let friendsList: Array<string> = [];
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${id}`);
    const userData: User = {
      uid: id,
      email: "",
      displayName: "",
      photoURL: "",
      photoDownloadURL: "",
      emailVerified: true,
      city: "",
      country: "",
      region: "",
      bio: "",
      friendsList: friendsList
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  createRoom(roomID, firstID, secondID) {
    let messages: Array<string> = [];
    let data = {
      user1: firstID,
      user2: secondID,
      createdAt: Date.now(),
      count: 0,
      messages: messages
    }
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`chats/${roomID}`);
    return userRef.set(data, {
      merge: true
    })
  }

  getUsersInYourCity(location, user) {
    this.foundUsersList = [];
    this.afs.collection('users', ref => ref
      .where('city', '==', location.city)
      .where('region', '==', location.regionName)
      .where('country', '==', location.countryName))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          const item = {
            username: doc.data().displayName,
            email: doc.data().email,
            bio: doc.data().bio,
            photoURL: doc.data().photoURL,
            country: doc.data().country,
            region: doc.data().region,
            city: doc.data().city,
            id: doc.data().uid,
            emailVerified: doc.data().emailVerified,
            photoDownloadURL: doc.data().photoDownloadURL,
            isInvited: false
          };
          if (item.id != user.id) {
            let alreadyFriends = false;
            user.friendsList.forEach(element => {
              if (item.id === element.id) {
                alreadyFriends = true
              }
            });
            if (!alreadyFriends) {
              this.foundUsersList.push(item);
            }
          }
        })
      });
    return this.foundUsersList;
  }
}
