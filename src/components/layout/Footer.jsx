import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden py-8 bg-white border-t md:block">
      <div className="flex items-center justify-between px-8 mx-auto text-sm text-gray-500">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1 text-green-700">
            <Leaf size={16} />
            <span className="font-semibold text-gray-900">GreenSpace</span>
          </div>
          <span className="text-xs">Nurturing communities, one garden at a time.</span>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Help Center</a>
        </div>
        <div className="text-xs">© 2024 GreenSpace. Organic Stewardship.</div>
      </div>
    </footer>
  );
}