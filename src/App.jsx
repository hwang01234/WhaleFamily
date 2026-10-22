import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Award, MessageSquare, BookOpen, Plus, Trash2, CheckCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Firebase 초기화 (Vercel 환경 변수 연동)
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
  const [shoppingItems, setShoppingItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');

  // 구성원 컬러 스타일 정의
  const members = [
    { name: '아빠', role: '데님 블루', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    { name: '엄마', role: '코랄 핑크', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
    { name: '첫째', role: '세이지 그린', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    { name: '둘째', role: '버터 옐로우', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  ];

  // 데이터 불러오기 (Firestore)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopSnap = await getDocs(collection(db, 'shopping'));
        setShoppingItems(shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const noticeSnap = await getDocs(collection(db, 'notices'));
        setNotices(noticeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("데이터 로딩 중 오류:", e);
      }
    };
    fetchData();
  }, []);

  // 장보기 추가
  const addShoppingItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'shopping'), { text: newItem, completed: false });
      setShoppingItems([...shoppingItems, { id: docRef.id, text: newItem, completed: false }]);
      setNewItem('');
    } catch (e) {
      console.error("추가 실패:", e);
    }
  };

  // 장보기 삭제
  const deleteShoppingItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'shopping', id));
      setShoppingItems(shoppingItems.filter(item => item.id !== id));
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-center text-stone-700">🐳 Whale Family Hub</h1>
        <div className="flex justify-center gap-2 mt-2">
          {members.map((m, idx) => (
            <span key={idx} className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.bg} ${m.text}`}>
              {m.name}
            </span>
          ))}
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-md mx-auto p-4">
        {activeTab === 'calendar' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">📅 공유 캘린더</h2>
            <p className="text-sm text-stone-500">가족의 소중한 일정과 일정을 한눈에 관리하세요.</p>
            <div className="mt-4 p-6 bg-stone-50 rounded-xl text-center text-stone-400">
              캘린더 기능이 준비 중입니다.
            </div>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">🛒 실시간 장보기 리스트</h2>
            <form onSubmit={addShoppingItem} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="필요한 물품을 입력하세요"
                className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
              />
              <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-medium">추가</button>
            </form>
            <ul className="space-y-2">
              {shoppingItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-sm">{item.text}</span>
                  <button onClick={() => deleteShoppingItem(item.id)} className="text-stone-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">🏆 가족 목표 & 보상</h2>
            <p className="text-sm text-stone-500">함께 세운 목표를 달성하고 보상을 받아보세요!</p>
            <div className="mt-4 p-6 bg-stone-50 rounded-xl text-center text-stone-400">
              목표 및 보상 대시보드 영역입니다.
            </div>
          </div>
        )}

        {activeTab === 'notice' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">📝 메모판 / 공지사항</h2>
            <p className="text-sm text-stone-500">가족들에게 전할 중요한 메모나 공지를 남기세요.</p>
            <div className="mt-4 p-6 bg-stone-50 rounded-xl text-center text-stone-400">
              등록된 공지사항이 없습니다.
            </div>
          </div>
        )}

        {activeTab === 'qt' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">📖 QTin 오늘의 묵상</h2>
            <p className="text-sm text-stone-500">오늘 하루 말씀을 통해 은혜를 나누는 공간입니다.</p>
            <div className="mt-4 p-6 bg-stone-50 rounded-xl text-center text-stone-400">
              오늘의 묵상 본문이 업데이트될 예정입니다.
            </div>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 바 (모바일 최적화) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around py-2 px-1 max-w-md mx-auto z-10 shadow-lg">
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'calendar' ? 'text-blue-600 font-bold' : 'text-stone-400'}`}>
          <Calendar size={20} />
          <span className="text-[10px] mt-1">캘린더</span>
        </button>
        <button onClick={() => setActiveTab('shopping')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'shopping' ? 'text-blue-600 font-bold' : 'text-stone-400'}`}>
          <ShoppingCart size={20} />
          <span className="text-[10px] mt-1">장보기</span>
        </button>
        <button onClick={() => setActiveTab('rewards')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'rewards' ? 'text-blue-600 font-bold' : 'text-stone-400'}`}>
          <Award size={20} />
          <span className="text-[10px] mt-1">목표/보상</span>
        </button>
        <button onClick={() => setActiveTab('notice')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'notice' ? 'text-blue-600 font-bold' : 'text-stone-400'}`}>
          <MessageSquare size={20} />
          <span className="text-[10px] mt-1">메모판</span>
        </button>
        <button onClick={() => setActiveTab('qt')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'qt' ? 'text-blue-600 font-bold' : 'text-stone-400'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] mt-1">QTin</span>
        </button>
      </nav>
    </div>
  );
}
