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
  onSnapshot
} from "firebase/firestore";

const kesimpulanCollection = collection(db, "kesimpulan");

export const tambahKesimpulan = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(kesimpulanCollection, {
    nama_kesimpulan: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editKesimpulan = async (id, nama) => {
  const timestamp = new Date();
  const docRef = doc(db, "kesimpulan", id);
  await updateDoc(docRef, {
    nama_kesimpulan: nama.trim(),
    updatedAt: timestamp,
  });
};

export const hapusKesimpulan = async (id) => {
  // Remove the conclusion from the "rules" collection
  const rulesQuerySnapshot = await getDocs(
    query(collection(db, "rules"), where("id_kesimpulan", "==", id))
  );

  const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
    updateDoc(ruleDoc.ref, {
      id_kesimpulan: arrayRemove(id),
    })
  );
  await Promise.all(updatePromises);

  // Delete the conclusion document
  await deleteDoc(doc(db, "kesimpulan", id));
};

export const ambilSemuaKesimpulan = (callback) => {
  const q = query(kesimpulanCollection, orderBy("createdAt", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
