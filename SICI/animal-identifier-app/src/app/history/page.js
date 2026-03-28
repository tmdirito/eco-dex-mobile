'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from '../page.module.css';
// import Header from '../components/Header';
import {doc, deleteDoc } from 'firebase/firestore';
function FirebaseImage({ path, altText }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path) return;
    const fetchUrl = async () => {
      try {
        const downloadUrl = await getDownloadURL(ref(storage, path));
        setUrl(downloadUrl);
      } catch (error) {
        console.warn("Could not load image:", path);
      }
    };
    fetchUrl();
  }, [path]);

  if (!url) {
    return <div className={styles.cardImage} style={{ backgroundColor: 'var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading image...</div>;
  }
  return <img src={url} alt={altText} className={styles.cardImage} />;
}


export default function HistoryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // Renamed for clarity
  // Page protector: redirect if not logged in

   const handleDelete = async (animalID) => {
      if (!currentUser) return; // Make sure user is still logged in
        // 1. ADD THE CONFIRMATION POPUP
        const confirmDelete = window.confirm("Are you sure you want to delete this discovery?");
    
    // 2. STOP IF THEY CLICK CANCEL
        if (!confirmDelete) return;
        setIsDeleting(true); // Disable buttons
        try {
      const docRef = doc(firestore, 'users', currentUser.uid, 'animals', animalID);
      
      await deleteDoc(docRef);

      
      } catch (error) {
        console.error("Error deleting document: ", error);
      } finally {
        setIsDeleting(false); // Re-enable buttons
      }
    }
  useEffect(() => { 
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Fetch animal history from Firestore
  useEffect(() => {
    if (!currentUser) return; // Don't run if no user is logged in

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals');
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to a readable string
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Date not available'
        };
      });
      setAnimals(animalsData);
      setIsLoading(false);
    });

   

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [currentUser]);

  if (isLoading) {
    return <p>Loading history...</p>;
  }

  return (
    <>
    
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>History</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          A log of all the animals/plants you've discovered.
        </p>

        <div className={styles.resultsContainer} style={{marginTop: '2rem', width: '100%'}}>
          {animals.length === 0 ? (
            <p>No animals identified yet. Go to "Identify Species" to start!</p>
          ) : (
            animals.map((animal) => (
              <div key={animal.id} className={styles.resultCard}>
                {animal.imagePath && <FirebaseImage path={animal.imagePath} altText={animal.commonName} />}
                <h3>{animal.commonName}</h3>
                <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
                <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
                <p style={{marginTop: '12px', color: 'var(--text-secondary)', lineHeight: '1.5'}}>{animal.description}</p>
                <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'gray'}}>
                  <em>Identified on: {animal.createdAt}</em>
                </p>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(animal.id)}
                      disabled={isDeleting}
                      className={styles.deleteButton}
                      >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
    </>
  );
}