import { useState, useEffect, useRef } from 'react';

interface UseImageLoadProps {
  src: string;
  placeholder?: string;
}

export const useImageLoad = ({ src, placeholder }: UseImageLoadProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();

    const handleLoad = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    const handleError = () => {
      setIsError(true);
      setIsLoading(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // Start loading the image
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return { imageSrc, isLoading, isError, imgRef };
};
