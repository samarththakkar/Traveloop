import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AvatarUpload({ user, avatarUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const initials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T';

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Mock progress
      const interval = setInterval(() => setProgress(p => (p < 90 ? p + 10 : p)), 100);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      clearInterval(interval);
      setProgress(100);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      
      onUploadSuccess(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Failed to upload photo.', type: 'error' } }));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-[#1D9E75] to-[#1A1A2E] flex items-center justify-center text-white text-2xl font-black relative">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
        
        {/* Upload Overlay */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-100"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Camera size={20} />
              <span className="text-[8px] font-bold uppercase mt-1">Change</span>
            </>
          )}
        </button>

        {/* Progress Ring */}
        {uploading && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle 
              cx="40" cy="40" r="38" 
              fill="none" stroke="#1D9E75" strokeWidth="4" 
              strokeDasharray={238.76}
              strokeDashoffset={238.76 - (238.76 * progress) / 100}
              className="transition-all duration-300"
            />
          </svg>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
