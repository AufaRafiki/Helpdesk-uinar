// src/services/notificationService.js
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { tambahFaktaPermasalahan } from "./faktaPermasalahanService";

const pengajuanCollection = collection(db, "pengajuan");

export const tambahNotification = async (description, pengusul) => {
  const timestamp = new Date();
  const docRef = await addDoc(pengajuanCollection, {
    description: description.trim(),
    createdAt: timestamp,
    handleAt: null,
    pengusul: pengusul,
    status: null,
    isRead: false,
  });
  return docRef.id;
};

export const ambilSemuaNotifications = (
  setNotifikasi,
  setLoading,
  updateUnreadCount
) => {
  const pengajuanQuery = query(
    pengajuanCollection,
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(pengajuanQuery, (querySnapshot) => {
    const pengajuanData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    getDocs(collection(db, "users")).then((usersQuerySnapshot) => {
      const usersData = usersQuerySnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().uid] = doc.data();
        return acc;
      }, {});

      const notifikasiData = pengajuanData.map((pengajuan) => {
        const pengusulData = usersData[pengajuan.pengusul] || {};
        return {
          ...pengajuan,
          pengusulNama: pengusulData.nama || "Unknown",
          pengusulNpm: pengusulData.npm || "Unknown",
        };
      });

      const sortedData = notifikasiData.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return a.isRead ? 1 : -1;
      });

      setNotifikasi(sortedData);
      setLoading(false);

      const unreadCount = sortedData.filter((notif) => !notif.isRead).length;
      updateUnreadCount(unreadCount);
    });
  });

  return unsubscribe;
};

export const tambahMenjadiFakta = async (
  description,
  selectedNotif,
  setToastMessage,
  handleClose
) => {
  const trimmedDescription = description.trim();
  if (!trimmedDescription) {
    throw new Error("Description cannot contain only spaces.");
  }
  try {
    // Tambahkan fakta permasalahan baru
    await tambahFaktaPermasalahan(trimmedDescription);
    setToastMessage(`Fact added successfully: ${trimmedDescription}`);

    // Perbarui status notifikasi menjadi "handled" dan isRead menjadi true
    if (selectedNotif) {
      const timestamp = new Date();
      await updateDoc(doc(pengajuanCollection, selectedNotif.id), {
        handleAt: timestamp,
        status: "handled",
        isRead: true,
      });
    }
    handleClose();
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const hapusNotification = async (
  selectedNotif,
  setToastMessage,
  handleClose
) => {
  try {
    await deleteDoc(doc(pengajuanCollection, selectedNotif.id));
    setToastMessage(`Notification deleted successfully!`);
    handleClose();
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const tandaiNotificationSebagaiDibaca = async (id, setToastMessage) => {
  try {
    await updateDoc(doc(pengajuanCollection, id), {
      isRead: true,
    });
    setToastMessage(`Notification marked as read successfully!`);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};
