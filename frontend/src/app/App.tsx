import { useState } from 'react';
import { Home } from '@/app/pages/Home';
import { ExpensesPage } from '@/app/pages/ExpensesPage';

type PageType = 'home' | 'expenses';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'expenses' && <ExpensesPage onNavigate={handleNavigate} />}
    </>
  );
}
