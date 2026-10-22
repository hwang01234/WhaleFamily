import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Award, MessageSquare, BookOpen, Trash2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  // 장보기 상태
  const [shoppingItems, setShoppingItems] = useState([]);
  const [newShopping, setNewShopping] = useState('');

  // 메모판 상태
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');

  const members = [
    { name: '아빠', bg: 'bg-blue-100', text: 'text-blue-800' },
    { name: '엄마', bg: 'bg-pink-100', text: 'text-pink-800' },
    { name: '첫째', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    { name: '둘째', bg: 'bg-amber-100', text: 'text-amber-800' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopSnap = await getDocs(collection(db, 'shopping'));
        setShoppingItems(shopSnap.docs.map(doc =>
