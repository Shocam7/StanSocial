import React from 'react';
import VideoExamplePage from '@/components/video-example-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Behind The Scenes | Interestan',
  description: 'Experience the magic behind the creation with our exclusive behind-the-scenes video.',
  keywords: ['behind the scenes', 'video', 'production', 'interestan'],
  openGraph: {
    title: 'Behind The Scenes | Interestan',
    description: 'Experience the magic behind the creation with our exclusive behind-the-scenes video.',
    images: [
      {
        url: '/og-video-preview.jpg', // You can add a video thumbnail here
        width: 1200,
        height: 630,
        alt: 'Behind The Scenes Video Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behind The Scenes | Interestan',
    description: 'Experience the magic behind the creation with our exclusive behind-the-scenes video.',
    images: ['/og-video-preview.jpg'],
  },
};

export default function VideoPage() {
  return <VideoExamplePage />;
}
