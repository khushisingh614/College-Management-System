// src/utils/syncUtils.js

import axios from "axios";
import { baseApiURL } from "../baseUrl";
const dbName = "SubmissionsDatabase";
const storeName = "submissions";

    //Offline storage
    const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

  // Open DB with auto-store-creation
  const openDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 5);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "_id", autoIncrement: true });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error opening IndexedDB");
    });
  };
  
  // Retrieve submissions from IndexedDB
  const getSubmissionsFromDB = async () => {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error retrieving submissions");
    });
  };
  
  // Delete a submission from IndexedDB after syncing
  const deleteSubmissionFromDB = async (submissionId) => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(submissionId);
  };
  
  // Sync offline submissions when back online
  const syncSubmissionsToBackend = async () => {
    const submissions = await getSubmissionsFromDB();
  
    for (let submission of submissions) {
      const formData = new FormData();
      Object.entries(submission).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      try {
        const response = await axios.post(
          `${baseApiURL()}/assignments/submit`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        if (response.status >= 200 && response.status < 300) {
            //console.log("sync done");
            console.log(`Submission ${submission._id} of student ${submission.studentName} synced successfully`);
            await deleteSubmissionFromDB(submission._id);
          } else {
            console.warn(`Unexpected status: ${response.status}`);
          }
      } catch (error) {
        console.error(`Failed to sync submission ${submission._id}:`, error);
      }
    }
  };
  
  // Export all functions
  export {
    openDB,
    getSubmissionsFromDB,
    deleteSubmissionFromDB,
    syncSubmissionsToBackend,
  };
  