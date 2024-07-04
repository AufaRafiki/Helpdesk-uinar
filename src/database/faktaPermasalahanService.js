import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  arrayRemove,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const faktaPermasalahanCollection = collection(db, "fakta-permasalahan");

export const tambahFaktaPermasalahan = async (nama) => {
  const timestamp = new Date();
  const docRef = await addDoc(faktaPermasalahanCollection, {
    nama_fakta: nama.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return docRef.id;
};

export const editFaktaPermasalahan = async (id, nama) => {
  const timestamp = new Date();
  const docRef = doc(db, "fakta-permasalahan", id);
  await updateDoc(docRef, {
    nama_fakta: nama.trim(),
    updatedAt: timestamp,
  });
};

export const hapusFaktaPermasalahan = async (id) => {
  // Remove the fact from the "rules" collection
  const rulesQuerySnapshot = await getDocs(
    query(collection(db, "rules"), where("id_fakta", "array-contains", id))
  );

  const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
    updateDoc(ruleDoc.ref, {
      id_fakta: arrayRemove(id),
    })
  );
  await Promise.all(updatePromises);

  // Delete the fact document
  await deleteDoc(doc(db, "fakta-permasalahan", id));
};

export const ambilSemuaFaktaPermasalahan = (callback) => {
  const q = query(faktaPermasalahanCollection, orderBy("createdAt", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
