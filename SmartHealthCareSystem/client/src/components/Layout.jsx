import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
      {/* Footer disclaimer */}
      <footer className="text-center py-6 border-t border-white/5">
        <p className="text-xs text-gray-500 max-w-2xl mx-auto px-4">
          ⚕️ <strong>Disclaimer:</strong> This app is not a substitute for professional medical advice, diagnosis, or treatment.
          Always seek the advice of your physician or other qualified health provider.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
