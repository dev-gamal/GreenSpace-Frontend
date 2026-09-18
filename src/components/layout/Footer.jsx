import logo from '../../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="hidden py-8 bg-white border-t md:block">
      <div className="flex items-center justify-between px-8 mx-auto text-sm text-gray-500">
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <img src={logo} alt="GreenSpace Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
          </div>
          <span className="text-xs">Nurturing communities, one garden at a time.</span>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Help Center</a>
        </div>
        <div className="text-xs">© 2026 GreenSpace. Organic Stewardship.</div>
      </div>
    </footer>
  );
}