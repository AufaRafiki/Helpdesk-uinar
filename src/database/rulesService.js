// ruleService.js
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const rulesCollection = collection(db, "rules");

export const tambahRule = async (rule) => {
  const timestamp = new Date();
  const docRef = await addDoc(rulesCollection, {
    ...rule,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editRule = async (id, rule) => {
  const timestamp = new Date();
  const docRef = doc(db, "rules", id);
  await updateDoc(docRef, {
    ...rule,
    updatedAt: timestamp,
  });
};

export const hapusRule = async (id) => {
  await deleteDoc(doc(db, "rules", id));
};

export const ambilSemuaRules = (callback) => {
  const q = query(rulesCollection, orderBy("createdAt", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
