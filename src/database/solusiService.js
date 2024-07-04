import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

const solusiCollection = collection(db, "solusi");

export const tambahSolusi = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(solusiCollection, {
    nama_solusi: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editSolusi = async (id, nama) => {
  const timestamp = new Date();
  const docRef = doc(db, "solusi", id);
  await updateDoc(docRef, {
    nama_solusi: nama.trim(),
    updatedAt: timestamp,
  });
};

export const hapusSolusi = async (id) => {
  // Remove the solution from the "rules" collection
  const rulesQuerySnapshot = await getDocs(
    query(collection(db, "rules"), where("id_solusi", "==", id))
  );

  const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
    updateDoc(ruleDoc.ref, {
      id_solusi: arrayRemove(id),
    })
  );
  await Promise.all(updatePromises);

  // Delete the solution document
  await deleteDoc(doc(db, "solusi", id));
};

export const ambilSemuaSolusi = (callback) => {
  const q = query(solusiCollection, orderBy("createdAt", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
