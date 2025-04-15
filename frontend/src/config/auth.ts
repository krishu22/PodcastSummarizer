import { auth } from "./firebase-config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  updatePassword, 
  sendEmailVerification,
  UserCredential
} from "firebase/auth";

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign in with Google provider
export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Sign out the current user
export const doSignOut = (): Promise<void> => {
  return auth.signOut();
}

// Send a password reset email to the given email address
export const doPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
}

// Update the current user's password
export const doPasswordChange = (password: string): Promise<void> => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  } else {
    return Promise.reject(new Error("No user is currently logged in."));
  }
}

// Send an email verification to the current user
export const doSendVerificationEmail = (): Promise<void> => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  } else {
    return Promise.reject(new Error("No user is currently logged in."));
  }
}
