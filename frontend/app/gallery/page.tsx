'use client';

import React, { useState } from 'react';
import { Camera, Upload, Heart, X, Play, Download } from 'lucide-react';

interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  url: string;
  title: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
  is_approved: boolean;
}

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'photos' | 'videos'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Sample media data (in real app, this would come from API)
  const mediaItems: MediaItem[] = [
    {
      id: 1,
      type: 'photo',
      url: '/api/placeholder/400/300',
      title: 'Engagement Photoshoot',
      description: 'Beautiful sunset engagement photos at the park',
      uploaded_by: 'Wedding Photographer',
      created_at: '2024-11-15',
      is_approved: true
    },
    {
      id: 2,
      type: 'photo',
      url: '/api/placeholder/400/300',
      title: 'Pre-wedding Celebration',
      description: 'Family gathering before the big day',
      uploaded_by: 'Sarah',
      created_at: '2024-11-20',
      is_approved: true
    },
    {
      id: 3,
      type: 'video',
      url: '/api/placeholder/400/300',
      title: 'Wedding Invitation Video',
      description: 'Our special invitation message for you',
      uploaded_by: 'Ahmad',
      created_at: '2024-12-01',
      is_approved: true
    },
    {
      id: 4,
      type: 'photo',
      url: '/api/placeholder/400/300',
      title: 'Mehendi Ceremony Prep',
      description: 'Getting ready for the mehendi celebration',
      uploaded_by: 'Family Friend',
      created_at: '2024-12-10',
      is_approved: true
    }
  ];

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'photos') return item.type === 'photo';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadForm(false);
      // In real app, you would upload to the API and refresh the gallery
      alert('Files uploaded successfully! They will appear after approval.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-semibold text-gray-900">Wedding Gallery</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-rose-500 transition-colors">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Wedding Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Relive the beautiful moments from our journey together. Upload your photos and videos to share the memories!
            </p>
            
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors flex items-center mx-auto"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Photos & Videos
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-rose-500 text-white' 
                    : 'text-gray-600 hover:text-rose-500'
                }`}
              >
                All ({mediaItems.length})
              </button>
              <button
                onClick={() => setFilter('photos')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  filter === 'photos' 
                    ? 'bg-rose-500 text-white' 
                    : 'text-gray-600 hover:text-rose-500'
                }`}
              >
                Photos ({mediaItems.filter(item => item.type === 'photo').length})
              </button>
              <button
                onClick={() => setFilter('videos')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  filter === 'videos' 
                    ? 'bg-rose-500 text-white' 
                    : 'text-gray-600 hover:text-rose-500'
                }`}
              >
                Videos ({mediaItems.filter(item => item.type === 'video').length})
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="relative aspect-square bg-gray-200">
                  {/* Placeholder for actual image/video */}
                  <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    {item.type === 'photo' ? (
                      <Camera className="h-12 w-12 text-rose-300" />
                    ) : (
                      <div className="relative">
                        <Camera className="h-12 w-12 text-rose-300" />
                        <Play className="h-6 w-6 text-rose-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      VIDEO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    by {item.uploaded_by} • {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMedia.length === 0 && (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No {filter} found</h3>
              <p className="text-gray-500">Be the first to upload some memories!</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {selectedMedia.type === 'photo' ? (
                  <Camera className="h-16 w-16 text-gray-400" />
                ) : (
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Video player would be here</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 mb-2">{selectedMedia.description}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded by {selectedMedia.uploaded_by} on {new Date(selectedMedia.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Upload Media</h3>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Uploading your memories...</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Share your photos and videos from our special moments. All uploads will be reviewed before appearing in the gallery.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-300 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">Click to upload files</p>
                      <p className="text-sm text-gray-500">Photos and videos up to 50MB each</p>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}