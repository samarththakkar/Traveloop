import { Link2, MessageCircle } from 'lucide-react';

export default function ShareButtons({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`Check out my trip on Traveloop: ${title}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Link copied! 🔗', type: 'success' } }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a 
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-xs px-4 py-2 rounded-full hover:scale-105 transition-all shadow-sm"
      >
        <MessageCircle size={14} /> WhatsApp
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-black text-white font-bold text-xs px-4 py-2 rounded-full hover:scale-105 transition-all shadow-sm"
      >
        <svg size={14} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X / Twitter
      </a>
      <button 
        onClick={handleCopy}
        className="flex items-center gap-2 border border-[#E8E0D5] bg-white text-[#6B6B7B] font-bold text-xs px-4 py-2 rounded-full hover:scale-105 hover:bg-[#FDF8F3] transition-all shadow-sm"
      >
        <Link2 size={14} /> Copy Link
      </button>
    </div>
  );
}
