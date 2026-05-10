import { Link, useNavigate } from 'react-router-dom';
import { Copy, Compass } from 'lucide-react';

export default function PublicNavbar({ user, onCopyLink }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-[#E8E0D5] h-[60px] shadow-sm flex items-center px-6">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center text-white">
            <Compass size={20} />
          </div>
          <span className="font-black text-xl text-[#1A1A2E] tracking-tight">Traveloop</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onCopyLink}
            className="hidden sm:flex items-center gap-2 border border-[#E8E0D5] text-[#1D9E75] font-bold text-xs px-4 py-2 rounded-full hover:bg-[#1D9E75]/5 transition-all"
          >
            <Copy size={14} /> Copy Link
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/trips" className="text-xs font-bold text-[#6B6B7B] hover:text-[#1D9E75] transition-colors hidden sm:block">My Trips</Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">
                {user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xs font-bold text-[#6B6B7B] hover:text-[#1D9E75] transition-colors">Login</Link>
              <Link to="/" className="bg-[#1D9E75] text-white font-bold text-xs px-5 py-2 rounded-full hover:bg-[#158562] transition-all">Sign up free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
