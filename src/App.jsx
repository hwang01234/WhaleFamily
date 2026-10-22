import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Award, MessageSquare, BookOpen, Trash2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

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
        setShoppingItems(shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const noticeSnap = await getDocs(collection(db, 'notices'));
        setNotices(noticeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("데이터 로딩 오류:", e);
      }
    };
    fetchData();
  }, []);

  // 장보기 추가/삭제
  const addShopping = async (e) => {
    e.preventDefault();
    if (!newShopping.trim()) return;
    const docRef = await addDoc(collection(db, 'shopping'), { text: newShopping });
    setShoppingItems([...shoppingItems, { id: docRef.id, text: newShopping }]);
    setNewShopping('');
  };
  const deleteShopping = async (id) => {
    await deleteDoc(doc(db, 'shopping', id));
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  // 메모판 추가/삭제
  const addNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.trim()) return;
    const docRef = await addDoc(collection(db, 'notices'), { text: newNotice });
    setNotices([...notices, { id: docRef.id, text: newNotice }]);
    setNewNotice('');
  };
  const deleteNotice = async (id) => {
    await deleteDoc(doc(db, 'notices', id));
    setNotices(notices.filter(n => n.id !== id));
  };

  // 구글 캘린더 URL (대한민국 공휴일 기본 예시)
  const calendarUrl = "https://calendar.google.com/calendar/embed?src=ko.south-korean%23holiday%40group.v.calendar.google.com&ctz=Asia%2FSeoul";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 pb-24">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-center text-stone-700">🐳 Whale Family Hub</h1>
        <div className="flex justify-center gap-2 mt-2">
          {members.map((m, idx) => (
            <span key={idx} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${m.bg} ${m.text}`}>
              {m.name}
            </span>
          ))}
        </div>
      </header>

      {/* 메
