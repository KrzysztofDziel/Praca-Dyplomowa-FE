import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
  ) {}

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
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }


  async updateMessage(message, chatId, source) {
    console.log("qweqweqwe",source);
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
