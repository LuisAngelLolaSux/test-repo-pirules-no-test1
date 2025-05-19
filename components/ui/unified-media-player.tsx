'use client';

import type React from 'react';

import { useRef, useEffect, useState } from 'react';

interface UnifiedMediaPlayerProps {
    src: string;
    className?: string;
    reverseOnHoverOut?: boolean;
    playOnceOnLoad?: boolean;
}

const UnifiedMediaPlayer: React.FC<UnifiedMediaPlayerProps> = ({
    src,
    className = '',
    reverseOnHoverOut = true,
    playOnceOnLoad = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [isGif, setIsGif] = useState(false);
    const [gifKey, setGifKey] = useState(0); // Para forzar la recarga del GIF

    // Detectar si el archivo es un GIF
    useEffect(() => {
        setIsGif(src.toLowerCase().endsWith('.gif'));
    }, [src]);

    // Lógica para videos
    useEffect(() => {
        if (!isGif && playOnceOnLoad && videoRef.current) {
            const video = videoRef.current;
            video
                .play()
                .then(() => {
                    setHasPlayed(true);
                })
                .catch((error) => console.error('Error al reproducir video:', error));

            video.onended = () => {
                video.currentTime = video.duration; // Fijar en el último frame
            };
        }
    }, [playOnceOnLoad, isGif]);

    const playVideo = () => {
        if (playOnceOnLoad || !videoRef.current || isGif) return;
        videoRef.current.currentTime = 0;
        videoRef.current.play();
    };

    const reverseVideo = () => {
        if (playOnceOnLoad || !reverseOnHoverOut || !videoRef.current || isGif) return;

        const video = videoRef.current;
        video.pause();

        let reverseInterval: number;
        const step = () => {
            if (video.currentTime > 0) {
                video.currentTime -= 0.05;
                reverseInterval = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(reverseInterval);
            }
        };
        requestAnimationFrame(step);
    };

    // Para GIFs, usamos CSS para controlar la animación
    const handleGifLoad = () => {
        if (playOnceOnLoad && !hasPlayed) {
            // Después de un tiempo estimado, detenemos la animación
            const timer = setTimeout(() => {
                setHasPlayed(true);
            }, 3000); // Tiempo estimado (ajustar según necesidad)

            return () => clearTimeout(timer);
        }
    };

    // Reiniciar la animación del GIF al hacer hover
    const handleGifMouseEnter = () => {
        if (!playOnceOnLoad && hasPlayed) {
            setGifKey((prev) => prev + 1); // Forzar recarga del GIF
            setHasPlayed(false);
        }
    };

    // Detener la animación del GIF al quitar el hover
    const handleGifMouseLeave = () => {
        if (!playOnceOnLoad) {
            setHasPlayed(true);
        }
    };

    if (isGif) {
        return (
            <div
                className={className}
                onMouseEnter={handleGifMouseEnter}
                onMouseLeave={handleGifMouseLeave}
            >
                <img
                    key={gifKey}
                    src={src || '/placeholder.svg'}
                    style={{
                        width: '100%',
                        height: 'auto',
                        margin: 0,
                        padding: 0,
                        // Si ya se ha reproducido, detenemos la animación
                        animationPlayState: hasPlayed ? 'paused' : 'running',
                    }}
                    onLoad={handleGifLoad}
                    alt="Animated content"
                />
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            src={src}
            className={`transition-transform duration-500 ease-in-out ${className}`}
            style={{ width: '100%', height: 'auto', margin: 0, padding: 0 }}
            muted
            playsInline
            onMouseEnter={playVideo}
            onMouseLeave={reverseVideo}
        />
    );
};

export default UnifiedMediaPlayer;
