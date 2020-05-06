export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    photoDownloadURL: string;
    emailVerified: boolean;
    bio: string;
    country: string;
    region: string;
    city: string;
    friendsList: Array<string>    
 }