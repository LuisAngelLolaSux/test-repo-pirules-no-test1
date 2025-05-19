import { useRef, useEffect, useState } from 'react';

interface HoverVideoProps {
    src: string;
    className?: string;
    reverseOnHoverOut?: boolean;
    playOnceOnLoad?: boolean;
}

const HoverVideo: React.FC<HoverVideoProps> = ({
    src,
    className = '',
    reverseOnHoverOut = true,
    playOnceOnLoad = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPlayed, setHasPlayed] = useState(false);

    useEffect(() => {
        if (playOnceOnLoad && videoRef.current) {
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
    }, [playOnceOnLoad]);

    const playVideo = () => {
        if (playOnceOnLoad || !videoRef.current) return; // Evita reproducir si playOnceOnLoad es true
        videoRef.current.currentTime = 0;
        videoRef.current.play();
    };

    const reverseVideo = () => {
        if (playOnceOnLoad || !reverseOnHoverOut || !videoRef.current) return; // Evita rebobinar si playOnceOnLoad es true

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

export default HoverVideo;
