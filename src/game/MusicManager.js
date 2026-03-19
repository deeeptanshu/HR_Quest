import { AUDIO_TRACKS } from './assets';

/**
 * MusicManager - Centralized music control system
 * Handles all background music transitions and playback
 */
export class MusicManager {
    constructor(scene) {
        this.scene = scene;
        this.currentTrack = null;
        this.currentKey = null;
        this.isMuted = false;

        // Music track definitions with metadata
        this.tracks = {
            menu: { ...AUDIO_TRACKS.menu, volume: 0.5, loop: true },
            overworld: { ...AUDIO_TRACKS.overworld, volume: 0.4, loop: true },
            desert: { ...AUDIO_TRACKS.desert, volume: 0.4, loop: true },
            town: { ...AUDIO_TRACKS.town, volume: 0.4, loop: true },
            battle: { ...AUDIO_TRACKS.battle, volume: 0.5, loop: true },
            battleIntense: { ...AUDIO_TRACKS.battleIntense, volume: 0.5, loop: true },
            bossBattle: { ...AUDIO_TRACKS.bossBattle, volume: 0.5, loop: true },
            victoryFanfare: { ...AUDIO_TRACKS.victoryFanfare, volume: 0.6, loop: false },
            defeat: { ...AUDIO_TRACKS.defeat, volume: 0.5, loop: false }
        };
        this.pendingTrackLoads = new Map();
    }

    ensureTrackLoaded(trackName) {
        const trackConfig = this.tracks[trackName];
        if (!trackConfig) {
            return Promise.reject(new Error(`Track "${trackName}" not found in MusicManager`));
        }

        if (this.scene.cache.audio.exists(trackConfig.key)) {
            return Promise.resolve(trackConfig);
        }

        if (this.pendingTrackLoads.has(trackConfig.key)) {
            return this.pendingTrackLoads.get(trackConfig.key);
        }

        const loadPromise = new Promise((resolve, reject) => {
            const cleanup = () => {
                this.scene.load.off('filecomplete-audio-' + trackConfig.key, onComplete);
                this.scene.load.off('loaderror', onError);
                this.pendingTrackLoads.delete(trackConfig.key);
            };

            const onComplete = (key) => {
                if (key !== trackConfig.key) {
                    return;
                }
                cleanup();
                resolve(trackConfig);
            };

            const onError = (file) => {
                if (file?.key !== trackConfig.key) {
                    return;
                }
                cleanup();
                reject(new Error(`Failed to load audio track "${trackName}"`));
            };

            this.scene.load.once('filecomplete-audio-' + trackConfig.key, onComplete);
            this.scene.load.on('loaderror', onError);
            this.scene.load.audio(trackConfig.key, `assets/${trackConfig.path}`);
            this.scene.load.start();
        });

        this.pendingTrackLoads.set(trackConfig.key, loadPromise);
        return loadPromise;
    }

    /**
     * Play a music track
     * @param {string} trackName - Name from this.tracks
     * @param {boolean} stopCurrent - Whether to stop current track first
     * @param {number} fadeInDuration - Fade in duration in ms (0 = no fade)
     */
    play(trackName, stopCurrent = true, fadeInDuration = 0) {
        if (!this.scene.sound || !this.scene.sound.context) {
            console.warn('Sound context not available');
            return null;
        }

        const trackConfig = this.tracks[trackName];
        if (!trackConfig) {
            console.warn(`Track "${trackName}" not found in MusicManager`);
            return null;
        }

        if (!this.scene.cache.audio.exists(trackConfig.key)) {
            this.ensureTrackLoaded(trackName)
                .then(() => this.play(trackName, stopCurrent, fadeInDuration))
                .catch((error) => console.warn(error.message));
            return null;
        }

        try {
            // Stop current track if requested
            if (stopCurrent && this.currentTrack) {
                this.stop();
            }

            // Create or get the sound object
            let sound = this.scene.sound.get(trackConfig.key);
            if (!sound) {
                sound = this.scene.sound.add(trackConfig.key, {
                    loop: trackConfig.loop,
                    volume: fadeInDuration > 0 ? 0 : trackConfig.volume
                });
            }

            // Play the track
            if (!sound.isPlaying) {
                sound.play();

                // Apply fade in if requested
                if (fadeInDuration > 0) {
                    this.scene.tweens.add({
                        targets: sound,
                        volume: trackConfig.volume,
                        duration: fadeInDuration,
                        ease: 'Linear'
                    });
                }
            }

            this.currentTrack = sound;
            this.currentKey = trackName;

            console.log(`MusicManager: Playing "${trackName}"`);
            return sound;

        } catch (e) {
            console.warn(`Failed to play music track "${trackName}":`, e);
            return null;
        }
    }

    /**
     * Stop the currently playing track
     * @param {number} fadeOutDuration - Fade out duration in ms (0 = immediate stop)
     */
    stop(fadeOutDuration = 0) {
        if (!this.currentTrack) return;

        try {
            if (fadeOutDuration > 0 && this.currentTrack.isPlaying) {
                // Fade out then stop
                this.scene.tweens.add({
                    targets: this.currentTrack,
                    volume: 0,
                    duration: fadeOutDuration,
                    ease: 'Linear',
                    onComplete: () => {
                        if (this.currentTrack) {
                            this.currentTrack.stop();
                        }
                    }
                });
            } else {
                // Immediate stop
                this.currentTrack.stop();
            }

            console.log(`MusicManager: Stopped "${this.currentKey}"`);
            this.currentTrack = null;
            this.currentKey = null;

        } catch (e) {
            console.warn('Failed to stop music track:', e);
        }
    }

    /**
     * Pause the currently playing track
     */
    pause() {
        if (!this.currentTrack || !this.currentTrack.isPlaying) return;

        try {
            this.currentTrack.pause();
            console.log(`MusicManager: Paused "${this.currentKey}"`);
        } catch (e) {
            console.warn('Failed to pause music track:', e);
        }
    }

    /**
     * Resume the currently paused track
     */
    resume() {
        if (!this.currentTrack || this.currentTrack.isPlaying) return;

        try {
            this.currentTrack.resume();
            console.log(`MusicManager: Resumed "${this.currentKey}"`);
        } catch (e) {
            console.warn('Failed to resume music track:', e);
        }
    }

    /**
     * Stop all music immediately
     */
    stopAll() {
        if (!this.scene.sound) return;

        try {
            this.scene.sound.stopAll();
            this.currentTrack = null;
            this.currentKey = null;
            console.log('MusicManager: Stopped all music');
        } catch (e) {
            console.warn('Failed to stop all music:', e);
        }
    }

    /**
     * Crossfade from current track to a new track
     * @param {string} newTrackName - Track to fade in
     * @param {number} duration - Crossfade duration in ms
     */
    crossfade(newTrackName, duration = 1000) {
        const oldTrack = this.currentTrack;
        const oldKey = this.currentKey;

        // Start new track with 0 volume
        const newTrack = this.play(newTrackName, false, 0);
        if (!newTrack) return;

        // Crossfade
        if (oldTrack && oldTrack.isPlaying) {
            // Fade out old track
            this.scene.tweens.add({
                targets: oldTrack,
                volume: 0,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    oldTrack.stop();
                    console.log(`MusicManager: Crossfaded from "${oldKey}" to "${newTrackName}"`);
                }
            });
        }

        // Fade in new track
        const trackConfig = this.tracks[newTrackName];
        this.scene.tweens.add({
            targets: newTrack,
            volume: trackConfig.volume,
            duration: duration,
            ease: 'Linear'
        });
    }

    /**
     * Set mute state for all music
     * @param {boolean} muted - Whether to mute
     */
    setMute(muted) {
        this.isMuted = muted;
        if (this.scene.sound && this.scene.sound.context) {
            this.scene.sound.mute = muted;
        }
    }

    /**
     * Get the currently playing track name
     * @returns {string|null}
     */
    getCurrentTrack() {
        return this.currentKey;
    }

    /**
     * Check if a track is currently playing
     * @returns {boolean}
     */
    isPlaying() {
        return this.currentTrack && this.currentTrack.isPlaying;
    }

    /**
     * Clean up - call when scene shuts down
     */
    destroy() {
        if (this.currentTrack) {
            try {
                this.currentTrack.stop();
                this.currentTrack.destroy();
            } catch (e) {
                console.warn('Failed to destroy music track:', e);
            }
        }
        this.currentTrack = null;
        this.currentKey = null;
        this.scene = null;
    }
}
