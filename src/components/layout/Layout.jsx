import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function Layout({ children, fullWidth = false, noFooter = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className={`flex-1 ${fullWidth ? '' : 'overflow-y-auto'} pb-20 md:pb-0`}>
        {fullWidth ? (
          children
        ) : (
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        )}
        {!noFooter && <Footer />}
      </main>
      <BottomNav />
    </div>
  );
}