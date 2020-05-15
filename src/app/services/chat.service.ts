import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private datePipe: DatePipe,
    private afs: AngularFirestore,
  ) { }

  get(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...(doc.payload.data() as object) };
        })
      );
  }

  async sendMessage(chatId, content, user) {

    let today = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');

    const data = {
      userID: user.id,
      userName: user.username,
      photoDownloadURL: user.photoDownloadURL,
      content,
      createdAtReadable: today,
      createdAt: Date.now()
    };

    if (user) {
      this.makeRoomForNewMsg(chatId);
      const ref = this.afs.collection('chats').doc(chatId);
      this.afs.collection('chats').doc(chatId).ref.get().then(function (doc) {
        if (doc.exists) {
          let msgCount: number;
          msgCount = doc.data().messages.length + 1;
          return ref.update({
            messages: firestore.FieldValue.arrayUnion(data),
            count: msgCount
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      })
    }
  }

  makeRoomForNewMsg(chatId) {
    const ref = this.afs.collection('chats').doc(chatId);
      this.afs.collection('chats').doc(chatId).ref.get().then(function (doc) {
        if (doc.exists) {
          let msgCount: number;
          msgCount = doc.data().messages.length + 1;
          if (msgCount === 300) {
            let slicedMessages = doc.data().messages.splice(1, doc.data().messages.length);
            return ref.update({
              messages: slicedMessages
            });
          }
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      })
    }
  


  async updateMessage(message, chatId, source) {
    let chat = source;
    chat.messages.forEach(element => {
      if (element.createdAt === message.createdAt) {
        element.content = '[ Wiadomość usunięta ]';
      }
    });
    if (chatId) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: chat.messages
      });
    }
  }

}
