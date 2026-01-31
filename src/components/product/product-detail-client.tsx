'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, Share2, Check, Link as LinkIcon, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ProductDetailClientProps {
  productId: string;
  productSlug: string;
  productTitle: string;
}

export function ProductDetailClient({ productId, productSlug, productTitle }: ProductDetailClientProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBookmark = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = `/login?callbackUrl=/product/${productSlug}`;
      return;
    }

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`/api/bookmarks?productId=${productId}`, {
          method: 'DELETE',
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/product/${productSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform: 'native' | 'facebook' | 'twitter' | 'whatsapp') => {
    const url = `${window.location.origin}/product/${productSlug}`;
    const text = `Check out this healthy product: ${productTitle}`;

    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({ title: productTitle, text, url });
          } catch {
            // User cancelled
          }
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
    }
  };

  return (
    <div className="flex gap-3 pt-4 border-t border-neutral-200">
      <Button
        variant="outline"
        size="lg"
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={cn(
          'flex-1 gap-2',
          isBookmarked && 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
        )}
      >
        <Heart className={cn('w-5 h-5', isBookmarked && 'fill-current')} />
        {isBookmarked ? 'Saved' : 'Save for Later'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="gap-2">
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </DropdownMenuItem>
          {typeof navigator !== 'undefined' && navigator.share && (
            <DropdownMenuItem onClick={() => handleShare('native')} className="gap-2 cursor-pointer">
              <Share2 className="w-4 h-4" />
              Share...
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2 cursor-pointer">
            <span className="text-base">💬</span>
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-2 cursor-pointer">
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
            <Twitter className="w-4 h-4 text-sky-500" />
            Twitter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
