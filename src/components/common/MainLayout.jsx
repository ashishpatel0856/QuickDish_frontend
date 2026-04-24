import { Outlet } from 'react-router-dom';
import { AiProvider } from '../../context/AiContext';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => (
  <AiProvider>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  </AiProvider>
);

export default MainLayout;