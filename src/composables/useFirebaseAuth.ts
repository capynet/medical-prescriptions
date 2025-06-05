import { firebaseApp } from "@/composables/useFirebase";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuth } from "@vueuse/firebase/useAuth";

const auth = getAuth(firebaseApp);
const { isAuthenticated, user } = useAuth(auth);
const signInCallback = () => signInWithPopup(auth, new GoogleAuthProvider());
const logOutCallback = () => signOut(auth);


export { isAuthenticated, user, signInCallback, logOutCallback };