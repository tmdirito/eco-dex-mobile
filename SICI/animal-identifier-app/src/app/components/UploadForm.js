'use client';

import { useState, useEffect } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, firestore } from '../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from '../page.module.css';

// --- UPDATED IMPORT: Added CameraSource ---
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState([]);
  const { currentUser } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [lastAnimalId, setLastAnimalId] = useState(null); 
  const [uploadMessage, setUploadMessage] = useState("Upload a picture or open your camera to begin.");

  // --- 1. Firestore Listener (Reads History in Real-Time) ---
  useEffect(() => {
    if (!currentUser) return; 

    const userId = currentUser.uid;
    const animalsCollection = collection(firestore, 'users', userId, 'animals'); 
    const q = query(animalsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnimals(animalsData);

      if (isProcessing && animalsData.length > 0 && animalsData[0].id !== lastAnimalId) {
        setIsProcessing(false); 
        setLastAnimalId(animalsData[0].id); 
        setUploadMessage("Analysis complete. Result added to history.");
      } else if (animalsData.length > 0 && lastAnimalId === null) {
          setLastAnimalId(animalsData[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, isProcessing, lastAnimalId]);

  // --- 2. Handle Camera Roll Selection ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setUploadMessage(`Selected: ${selectedFile.name}`);
    }
  };

  // --- 3. Handle Native Camera Capture ---
  const handleCameraCapture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera // Forces the native camera to open
      });

      // Capacitor returns a local device path. We must fetch it and convert it 
      // to a standard web 'File' object so Firebase Storage can process it.
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      
      const filename = `camera_${Date.now()}.jpeg`;
      const fileObj = new File([blob], filename, { type: 'image/jpeg' });
      
      setFile(fileObj);
      setImagePreview(image.webPath);
      setUploadMessage("Photo captured. Ready to identify.");
    } catch (error) {
      console.log("Camera cancelled or failed", error);
    }
  };
  
  // --- 4. Form Submission (Starts the Upload/AI Process) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    setIsProcessing(true); 
    setError('');
    setUploadMessage("Uploading file and starting AI analysis...");

    try {
      const userId = currentUser.uid;
      const fileExtension = file.name.split('.').pop();
      const filePath = `userUploads/${userId}/${Date.now()}.${fileExtension}`; 
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, file);
      setUploadMessage("AI analysis running in the background. This may take a moment...");
      
    } catch (err) {
      console.error('File upload failed:', err);
      setError('File upload failed. Check the emulator status and network connection.');
      setIsProcessing(false); 
      setUploadMessage("Upload failed.");
    } 
  };

  // --- 5. Render Logic ---
  return (
    <div>
      <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent-color)'}}>Identify Species</h2>
<p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{uploadMessage}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* NEW UI: Two buttons side-by-side */}
        <div style={{ display: 'flex', gap: '1rem', justifyItems: 'center', marginBottom: '1rem', width: '100%' }}>
          
          <button 
            type="button" 
            onClick={handleCameraCapture} 
            className={styles.button}
            disabled={isProcessing}
            style={{ opacity: isProcessing ? 0.5 : 1, margin: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            Camera
          </button>

          <label 
            htmlFor="file-upload" 
            className={styles.button} 
            style={{opacity: isProcessing ? 0.5 : 1, margin: 0, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            Gallery
          </label>
        </div>

        <input 
          id="file-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isProcessing}
          style={{ display: 'none' }} 
        />

        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Selected preview" 
            style={{ width: '100%', maxWidth: '300px', height: 'auto', border: '1px solid var(--card-border)', borderRadius: '12px', margin: '10px auto', display: 'block' }} 
          />
        )}
        
        <button 
          type="submit" 
          className={styles.button} 
          disabled={isProcessing || !file}
          style={{ marginTop: '1.5rem' }}
        >
          {isProcessing ? 'ANALYZING...' : 'Identify Animal/Plant'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      <hr style={{margin: '3rem 0', border: 'none', borderTop: `1px solid var(--card-border)`}} />

      <h2>Your Identified Species</h2>
      {animals.length === 0 && <p>No species identified yet.</p>}
      {animals.map((animal) => (
        <div key={animal.id} className={styles.resultCard}>
          <h3>{animal.commonName}</h3>
          <p><strong>Scientific Name:</strong> {animal.scientificName}</p>
          <p><strong>Conservation Status:</strong> {animal.conservationStatus}</p>
          <p style={{marginTop: '12px', color: 'var(--text-secondary)', lineHeight: '1.5'}}>{animal.description}</p>
          <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'gray'}}>
            <em>Identified on: {animal.createdAt ? animal.createdAt.toDate().toLocaleString() : 'Date not available'}</em>
          </p>
        </div>
      ))}
    </div>
  );
}