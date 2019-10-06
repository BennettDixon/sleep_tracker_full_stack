import app from "firebase/app";
import "firebase/auth";
var config = {
  apiKey: "AIzaSyDusjtiy7LSnrq4dgrLffgVdBwcPQHJCnE",
  authDomain: "debugbox.firebaseapp.com"
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSendEmailVerification = () => this.auth.currentUser.sendEmailVerification();

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  getUserToken = () =>
    this.auth.currentUser.getIdToken(/* forceRefresh */ true);
}

export default Firebase;
