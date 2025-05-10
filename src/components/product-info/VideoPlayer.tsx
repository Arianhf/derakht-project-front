import React, { useState, useRef, useEffect } from 'react';
import styles from './VideoPlayer.module.scss';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface VideoPlayerProps {
    src: string;
    type?: string;
    title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type = 'video/mp4', title }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Initialize video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateDuration = () => {
            setDuration(video.duration);
        };

        const updateTime = () => {
            setCurrentTime(video.currentTime);
        };

        const handleVideoEnd = () => {
            setIsPlaying(false);
        };

        // Add event listeners
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('ended', handleVideoEnd);

        // Cleanup
        return () => {
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('ended', handleVideoEnd);
        };
    }, []);

    // Handle play/pause
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }

        setIsPlaying(!isPlaying);
    };

    // Handle mute/unmute
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(!isMuted);
    };

    // Handle full screen
    const toggleFullScreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!isFullScreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const seekTime = parseFloat(e.target.value);
        video.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    // Format time (seconds to MM:SS)
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return '00:00';

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.videoPlayerContainer} ref={containerRef}>
            {title && <div className={styles.videoTitle}>{title}</div>}

            <video
                ref={videoRef}
                className={styles.videoElement}
                onClick={togglePlay}
            >
                <source src={src} type={type} />
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>

            <div className={styles.controls}>
                <button className={styles.playButton} onClick={togglePlay}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <div className={styles.progressContainer}>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className={styles.progressBar}
                    />
                    <div className={styles.timeDisplay}>
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className={styles.rightControls}>
                    <button className={styles.muteButton} onClick={toggleMute}>
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>

                    <button className={styles.fullscreenButton} onClick={toggleFullScreen}>
                        {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;