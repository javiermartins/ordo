import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;
  public loading: boolean = true;

  constructor(
    private firestore: AngularFirestore
  ) { }

  getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
      this.loading = false;
    });
  }

  loginWithGoogle() {
    return signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  isAuthenticated(): boolean {
    return getAuth() !== null;
  }

  async checkAndCreateUser() {
    lastValueFrom(this.firestore.collection(environment.USERS_COLLETION).doc(this.user?.uid).get()).then(doc => {
      if (!doc.exists) {
        this.addUser(this.user);
      }
    });
  }

  addUser(user: any): Promise<void> {
    const addUser = {
      name: user?.displayName,
      email: user?.email
    }

    return this.firestore.collection(environment.USERS_COLLETION).doc(user.uid).set(addUser);
  }

  async logout() {
    return signOut(getAuth());
  }
}
