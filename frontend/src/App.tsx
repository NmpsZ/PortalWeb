import React from 'react';
import Header from './components/layout/Header';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;

