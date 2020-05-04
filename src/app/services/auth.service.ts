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
  foundUsersList: Array<UserModel> = [];

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public storage: AngularFireStorage,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
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
        console.log("Document data:", profile);
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
    if (user.photoDownloadURL != "") {
      this.storage.storage.refFromURL(`${user.photoDownloadURL}`).delete();
    }
    this.afs.doc(`users/${user.id}`).delete().then(function () {
      console.log("Document successfully deleted!", user.id);
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });

    this.afAuth.auth.currentUser.delete().then(() => {
      this.SignOut();
    })
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
        window.alert(error.message)
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
        window.alert(error.message)
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
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  SetUserDataRegister(user, userName, bio) {
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
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  getUsersInYourCity(location, id) {
    this.foundUsersList = [];
    this.afs.collection('users', ref => ref
      .where('city', '==', location.city)
      .where('region', '==', location.regionName)
      .where('country', '==', location.countryName))
      .get().subscribe(val => {
        val.docs.forEach(doc => {
          const item: UserModel = {
            username: doc.data().displayName,
            email: doc.data().email,
            bio: doc.data().bio,
            photoURL: doc.data().photoURL,
            country: doc.data().country,
            region: doc.data().region,
            city: doc.data().city,
            id: doc.data().uid,
            emailVerified: doc.data().emailVerified,
            photoDownloadURL: doc.data().photoDownloadURL
          };
          if (item.id !== id) {
            this.foundUsersList.push(item);
          }
        })
      });
      return this.foundUsersList;
  }
}
