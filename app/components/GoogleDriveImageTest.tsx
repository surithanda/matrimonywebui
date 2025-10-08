/**
 * Google Drive Image Configuration Test
 * Use this to verify that Google Drive images are loading correctly in production
 */

'use client';
import React, { useState } from 'react';
import EnhancedImage from './EnhancedImage';

const GoogleDriveImageTest: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sample Google Drive URLs for testing
  const sampleUrls = [
    'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
    'https://drive.google.com/uc?export=view&id=1A2B3C4D5E6F7G8H9I0J',
    'https://lh3.googleusercontent.com/d/1A2B3C4D5E6F7G8H9I0J',
    'https://docs.google.com/uc?export=download&id=1A2B3C4D5E6F7G8H9I0J'
  ];

  const handleLoad = () => {
    setLoadStatus('success');
    console.log('✅ Google Drive image loaded successfully:', testUrl);
  };

  const handleError = () => {
    setLoadStatus('error');
    console.error('❌ Failed to load Google Drive image:', testUrl);
  };

  const testUrl_ = (url: string) => {
    setTestUrl(url);
    setLoadStatus('loading');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Google Drive Image Configuration Test</h2>
      
      {/* URL Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Test Google Drive URL:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Paste your Google Drive image URL here..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setLoadStatus('loading')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Test
          </button>
        </div>
      </div>

      {/* Sample URLs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Sample URL Formats:</h3>
        <div className="grid gap-2">
          {sampleUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => testUrl_(url)}
              className="text-left p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="font-mono text-sm text-blue-600">{url}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Load Status */}
      {loadStatus !== 'idle' && (
        <div className="mb-6">
          <div className={`p-3 rounded-md ${
            loadStatus === 'loading' ? 'bg-blue-100 text-blue-800' :
            loadStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {loadStatus === 'loading' && '🔄 Loading image...'}
            {loadStatus === 'success' && '✅ Image loaded successfully!'}
            {loadStatus === 'error' && '❌ Failed to load image. Check console for details.'}
          </div>
        </div>
      )}

      {/* Test Image Display */}
      {testUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Test Result:</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-3">
              Testing URL: <span className="font-mono">{testUrl}</span>
            </p>
            <div className="relative w-full max-w-md mx-auto">
              <EnhancedImage
                src={testUrl}
                alt="Google Drive test image"
                width={400}
                height={300}
                className="border rounded-md"
                onLoad={handleLoad}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Configuration Info */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📋 Configuration Checklist:</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Added Google Drive domains to next.config.js</li>
          <li>✅ Configured remote patterns for image optimization</li>
          <li>✅ Set up Content-Security-Policy headers</li>
          <li>✅ Created EnhancedImage component with error handling</li>
          <li>⏳ Deploy to production and test this component</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleDriveImageTest;