import { db } from "./index";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { auth } from "./index";
import { hashPassowrd } from "../HashedPassword/EncryptedPassword";

export const signInUser = async (data) => {
  try {
    const docRef = doc(db, "users", data.uid);
    await setDoc(docRef, {
      email: data.email,
      password: data.password,
      uId: data.uid,
      userImage: "",
    });
    return { data, id: docRef.id };
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (data) => {
  const hash = hashPassowrd(data.password);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      hash
    );
    const uid = userCredential.user.uid;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const logoutUser = async () => {
  await auth.signOut().then(()=>{
  }).catch((err)=>{
    console.log(err.message)
  });
};
