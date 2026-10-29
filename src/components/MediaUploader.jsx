import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, Check, AlertTriangle, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MediaUploader = ({
  value = '',
  onChange,
  mediaType = 'image', // 'image', 'video', 'all'
  folder = 'general',
  label = 'Upload Media',
  hint = '',
  placeholder = 'https://...',
  className = ''
}) => {
  const { uploadMediaFile, showToast } = useApp();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(Boolean(!value || value.startsWith('http')));
  const [manualUrl, setManualUrl] = useState(value || '');

  // Determine if current value is video
  const isVideo = Boolean(
    mediaType === 'video' ||
    (typeof value === 'string' && (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov') || value.includes('youtube.com') || value.includes('youtu.be') || value.includes('vimeo.com')))
  );

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsUploading(true);
    setUploadProgress(10);

    const result = await uploadMediaFile(
      file,
      { folder },
      (progress) => setUploadProgress(progress)
    );

    setIsUploading(false);

    if (result.success && result.url) {
      setManualUrl(result.url);
      if (onChange) onChange(result.url, result);
      showToast('Media uploaded to Supabase Storage!', 'success');
    } else {
      setErrorMessage(result.message || 'Upload failed.');
      if (result.limitExceeded) {
        setShowUrlInput(true);
      }
    }

    // Reset input so user can choose another file if desired
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setManualUrl('');
    setErrorMessage('');
    if (onChange) onChange('', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualUrlChange = (e) => {
    const newUrl = e.target.value;
    setManualUrl(newUrl);
    if (onChange) onChange(newUrl, { url: newUrl });
  };

  const acceptMime = mediaType === 'video'
    ? 'video/mp4,video/webm,video/quicktime'
    : mediaType === 'image'
      ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'
      : 'image/*,video/*';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-cyan-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Remove Media
          </button>
        )}
      </div>

      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW CARD */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 group">
          {isVideo ? (
            <div className="aspect-video w-full flex items-center justify-center bg-black/60">
              {value.includes('youtube.com') || value.includes('youtu.be') ? (
                <div className="text-center p-4">
                  <Video className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-white font-mono truncate max-w-xs">{value}</p>
                  <span className="text-[10px] text-cyan-300">Embedded Video Link</span>
                </div>
              ) : (
                <video
                  src={value}
                  controls
                  className="w-full max-h-48 object-contain"
                  preload="metadata"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-40 bg-slate-900/60 flex items-center justify-center overflow-hidden">
              <img
                src={value}
                alt="Uploaded media preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-xs text-slate-500 p-4">Image preview unavailable</span>';
                }}
              />
            </div>
          )}

          {/* Action Overlay */}
          <div className="p-3 bg-slate-900/95 border-t border-cyan-500/20 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-300 font-mono truncate max-w-[220px]">
              {value}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-semibold flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isUploading ? 'animate-spin' : ''}`} /> Replace
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DROP/UPLOAD ZONE WHEN EMPTY */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-5 text-center cursor-pointer transition-all bg-cyan-950/20 hover:bg-cyan-950/40 group ${
            isUploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            {mediaType === 'video' ? <Video className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
          </div>

          <p className="text-xs font-semibold text-white">
            {isUploading ? 'Uploading to Supabase Storage...' : 'Click to Upload from Computer'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {mediaType === 'video'
              ? 'Supports MP4, WebM (Free-tier limit up to 50 MB)'
              : 'Supports JPG, PNG, WebP, SVG, GIF (up to 50 MB)'}
          </p>

          {isUploading && (
            <div className="mt-3 max-w-xs mx-auto">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-1.5 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-cyan-300 font-mono mt-1 block">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMime}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* EXTERNAL URL TOGGLE / INPUT */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Hide URL input' : 'Or paste external media URL (YouTube, Drive, Cloud)'}
        </button>

        {showUrlInput && (
          <div className="mt-1.5 flex gap-2">
            <input
              type="url"
              placeholder={placeholder || 'https://images.unsplash.com/... or https://youtube.com/...'}
              value={manualUrl}
              onChange={handleManualUrlChange}
              className="flex-1 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
