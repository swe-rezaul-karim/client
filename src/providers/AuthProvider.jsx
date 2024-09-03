import { createContext, useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged,signOut } from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  }
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    }
  },[]);
  const authInfo = {
    user,
    loading,
    createUser,
    logInUser,
    logInWithGoogle,
    logOut
  }
return(
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
)
}

export default AuthProvider;
