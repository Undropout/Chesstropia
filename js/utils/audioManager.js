// Manages simple sound effects with emotional awareness
export class AudioManager {
    constructor() {
        this.enabled = this.loadPreference();
        this.volume = 0.5;
        this.emotionalVolume = 0.7; // Louder for emotional moments
        this.context = null;
        this.sounds = new Map();
        this.currentMood = 'neutral';
        this.loadingSounds = new Set();
        
        this.initializeAudio();
        this.setupSoundMap();
    }
    
    loadPreference() {
        return localStorage.getItem('chesstropia_audio') !== 'false';
    }
    
    savePreference() {
        localStorage.setItem('chesstropia_audio', this.enabled);
    }
    
    initializeAudio() {
        // Create audio context on first user interaction
        const initContext = () => {
            if (!this.context) {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.loadSounds();
            }
            document.removeEventListener('click', initContext);
        };
        
        document.addEventListener('click', initContext);
    }
    
    setupSoundMap() {
        // Map of sound effects with emotional variants
        this.soundDefinitions = {
            // Movement sounds
            move: {
                neutral: { frequency: 440, duration: 0.1, type: 'sine' },
                anxious: { frequency: 440, duration: 0.05, type: 'triangle', vibrato: true },
                confident: { frequency: 523, duration: 0.15, type: 'sine' }
            },
            
            // Capture sounds
            capture: {
                neutral: { frequency: 329, duration: 0.2, type: 'sawtooth', decay: true },
                guilty: { frequency: 293, duration: 0.3, type: 'sine', fadeOut: true },
                necessary: { frequency: 349, duration: 0.15, type: 'square', sharp: true }
            },
            
            // Emotional state changes
            trust_up: {
                small: { frequencies: [523, 659], duration: 0.3, type: 'sine' },
                medium: { frequencies: [523, 659, 784], duration: 0.4, type: 'sine' },
                large: { frequencies: [523, 659, 784, 1047], duration: 0.5, type: 'sine' }
            },
            
            trust_down: {
                small: { frequency: 440, duration: 0.2, type: 'sine', slideDown: true },
                medium: { frequency: 440, duration: 0.3, type: 'triangle', slideDown: true },
                large: { frequency: 440, duration: 0.5, type: 'sawtooth', slideDown: true }
            },
            
            // Dysregulation sounds
            dysregulation: {
                anxiety: { frequency: 880, duration: 0.1, type: 'triangle', repeat: 3 },
                shutdown: { frequency: 220, duration: 1.0, type: 'sine', fadeIn: true },
                fight: { frequency: 110, duration: 0.2, type: 'sawtooth', distortion: true },
                freeze: { frequency: 1760, duration: 0.05, type: 'sine', echo: true },
                fawn: { frequencies: [440, 550], duration: 0.3, type: 'sine', waver: true }
            },
            
            // Breakthrough moment
            breakthrough: {
                start: { frequencies: [261, 329, 392], duration: 0.5, type: 'sine' },
                swell: { frequencies: [261, 329, 392, 523], duration: 1.0, type: 'sine' },
                complete: { frequencies: [261, 329, 392, 523, 659, 784], duration: 2.0, type: 'sine', reverb: true }
            },
            
            // Storm sounds
            storm: {
                warning: { frequency: 55, duration: 2.0, type: 'sine', rumble: true },
                active: { frequencies: [55, 110, 220], duration: 0.5, type: 'noise', repeat: true },
                passing: { frequency: 110, duration: 3.0, type: 'sine', fadeOut: true }
            },
            
            // UI feedback
            empathy: {
                success: { frequencies: [659, 784], duration: 0.2, type: 'sine' },
                failure: { frequency: 293, duration: 0.3, type: 'triangle', dissonant: true },
                perfect: { frequencies: [523, 659, 784, 1047], duration: 0.5, type: 'sine', sparkle: true }
            },
            
            // Ambient emotional tones
            ambient: {
                tension: { frequency: 110, duration: null, type: 'sine', continuous: true },
                calm: { frequencies: [261, 392, 523], duration: null, type: 'sine', continuous: true },
                hope: { frequencies: [440, 554, 659], duration: null, type: 'sine', continuous: true }
            }
        };
    }
    
    async loadSounds() {
        if (!this.context) return;
        
        // Generate sounds dynamically rather than loading files
        for (const [soundName, variants] of Object.entries(this.soundDefinitions)) {
            this.sounds.set(soundName, variants);
        }
    }
    
    play(soundName, options = {}) {
        if (!this.enabled || !this.context) return;
        
        const soundVariants = this.sounds.get(soundName);
        if (!soundVariants) return;
        
        // Select variant based on emotional context
        const variant = options.variant || this.selectVariant(soundName, options);
        const soundDef = soundVariants[variant] || soundVariants.neutral || Object.values(soundVariants)[0];
        
        // Generate and play sound
        this.generateSound(soundDef, options);
    }
    
    selectVariant(soundName, options) {
        // Select appropriate variant based on context
        if (options.emotion) {
            return options.emotion;
        }
        
        if (options.trustChange) {
            if (Math.abs(options.trustChange) < 1) return 'small';
            if (Math.abs(options.trustChange) < 3) return 'medium';
            return 'large';
        }
        
        return 'neutral';
    }
    
    generateSound(soundDef, options) {
        const now = this.context.currentTime;
        const volume = options.volume || (options.emotional ? this.emotionalVolume : this.volume);
        
        if (soundDef.frequencies) {
            // Chord or sequence
            soundDef.frequencies.forEach((freq, index) => {
                const delay = soundDef.arpeggio ? index * 0.05 : 0;
                this.playTone(freq, soundDef, now + delay, volume);
            });
        } else if (soundDef.frequency) {
            // Single tone
            this.playTone(soundDef.frequency, soundDef, now, volume);
        } else if (soundDef.type === 'noise') {
            // Noise generator for storm effects
            this.playNoise(soundDef, now, volume);
        }
        
        // Handle continuous sounds
        if (soundDef.continuous) {
            return {
                stop: () => this.stopContinuous(soundDef)
            };
        }
    }
    
    playTone(frequency, soundDef, startTime, volume) {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        // Set oscillator type
        oscillator.type = soundDef.type || 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        
        // Apply effects
        if (soundDef.vibrato) {
            this.applyVibrato(oscillator, startTime);
        }
        
        if (soundDef.slideDown) {
            oscillator.frequency.exponentialRampToValueAtTime(
                frequency / 2, 
                startTime + soundDef.duration
            );
        }
        
        if (soundDef.waver) {
            this.applyWaver(oscillator, startTime, soundDef.duration);
        }
        
        // Set envelope
        gainNode.gain.setValueAtTime(0, startTime);
        
        if (soundDef.fadeIn) {
            gainNode.gain.linearRampToValueAtTime(volume, startTime + soundDef.duration / 2);
            gainNode.gain.linearRampToValueAtTime(0, startTime + soundDef.duration);
        } else if (soundDef.fadeOut) {
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + soundDef.duration);
        } else {
            // Standard ADSR
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + soundDef.duration * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + soundDef.duration);
        }
        
        // Apply effects chain
        let currentNode = oscillator;
        
        if (soundDef.distortion) {
            const distortion = this.createDistortion();
            currentNode.connect(distortion);
            currentNode = distortion;
        }
        
        if (soundDef.echo) {
            const delay = this.createDelay(0.2, 0.5);
            currentNode.connect(delay);
            currentNode = delay;
        }
        
        if (soundDef.reverb) {
            const reverb = this.createReverb();
            currentNode.connect(reverb);
            currentNode = reverb;
        }
        
        currentNode.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        // Start and stop
        oscillator.start(startTime);
        oscillator.stop(startTime + soundDef.duration + (soundDef.echo ? 0.5 : 0));
        
        // Handle repeats
        if (soundDef.repeat) {
            for (let i = 1; i <= soundDef.repeat; i++) {
                setTimeout(() => {
                    this.playTone(frequency, { ...soundDef, repeat: false }, 
                                 this.context.currentTime, volume * (1 - i * 0.2));
                }, i * soundDef.duration * 1000);
            }
        }
    }
    
    playNoise(soundDef, startTime, volume) {
        const bufferSize = 2 * this.context.sampleRate;
        const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = this.context.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(volume * 0.1, startTime);
        
        // Apply low-pass filter for rumble
        if (soundDef.rumble) {
            const filter = this.context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, startTime);
            whiteNoise.connect(filter);
            filter.connect(gainNode);
        } else {
            whiteNoise.connect(gainNode);
        }
        
        gainNode.connect(this.context.destination);
        
        whiteNoise.start(startTime);
        whiteNoise.stop(startTime + soundDef.duration);
    }
    
    applyVibrato(oscillator, startTime) {
        const vibrato = this.context.createOscillator();
        const vibratoGain = this.context.createGain();
        
        vibrato.frequency.setValueAtTime(5, startTime);
        vibratoGain.gain.setValueAtTime(10, startTime);
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        
        vibrato.start(startTime);
        vibrato.stop(startTime + 10); // Long duration for continuous sounds
    }
    
    applyWaver(oscillator, startTime, duration) {
        const waver = this.context.createOscillator();
        const waverGain = this.context.createGain();
        
        waver.frequency.setValueAtTime(2, startTime);
        waverGain.gain.setValueAtTime(20, startTime);
        
        waver.connect(waverGain);
        waverGain.connect(oscillator.frequency);
        
        waver.start(startTime);
        waver.stop(startTime + duration);
    }
    
    createDistortion() {
        const waveshaper = this.context.createWaveShaper();
        const curve = new Float32Array(256);
        
        for (let i = 0; i < 128; i++) {
            curve[i] = -1 + (i / 64);
            curve[i + 128] = 1 - ((127 - i) / 64);
        }
        
        waveshaper.curve = curve;
        return waveshaper;
    }
    
    createDelay(delayTime, feedback) {
        const delay = this.context.createDelay();
        const feedbackGain = this.context.createGain();
        
        delay.delayTime.value = delayTime;
        feedbackGain.gain.value = feedback;
        
        delay.connect(feedbackGain);
        feedbackGain.connect(delay);
        
        return delay;
    }
    
    createReverb() {
        const convolver = this.context.createConvolver();
        const impulseLength = this.context.sampleRate * 2;
        const impulse = this.context.createBuffer(2, impulseLength, this.context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < impulseLength; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }
    
    // Emotional state audio
    setEmotionalState(state) {
        this.currentMood = state;
        
        // Adjust ambient sound based on emotional state
        if (state === 'tense') {
            this.startAmbient('tension');
        } else if (state === 'calm') {
            this.startAmbient('calm');
        } else if (state === 'hopeful') {
            this.startAmbient('hope');
        } else {
            this.stopAmbient();
        }
    }
    
    startAmbient(type) {
        this.stopAmbient();
        
        const soundDef = this.soundDefinitions.ambient[type];
        if (!soundDef) return;
        
        this.ambientSound = this.generateSound(soundDef, { volume: 0.1 });
    }
    
    stopAmbient() {
        if (this.ambientSound && this.ambientSound.stop) {
            this.ambientSound.stop();
            this.ambientSound = null;
        }
    }
    
    // Storm audio effects
    playStormSequence(phase) {
        switch(phase) {
            case 'approaching':
                this.play('storm', { variant: 'warning', volume: 0.3 });
                break;
                
            case 'active':
                // Continuous storm sounds
                this.stormInterval = setInterval(() => {
                    this.play('storm', { 
                        variant: 'active', 
                        volume: 0.2 + Math.random() * 0.3 
                    });
                }, 2000);
                break;
                
            case 'passing':
                if (this.stormInterval) {
                    clearInterval(this.stormInterval);
                }
                this.play('storm', { variant: 'passing', volume: 0.4 });
                break;
        }
    }
    
    // Breakthrough sequence
    playBreakthroughSequence() {
        const sequence = ['start', 'swell', 'complete'];
        sequence.forEach((variant, index) => {
            setTimeout(() => {
                this.play('breakthrough', { 
                    variant, 
                    volume: 0.5 + index * 0.2,
                    emotional: true 
                });
            }, index * 800);
        });
    }
    
    // Settings
    setEnabled(enabled) {
        this.enabled = enabled;
        this.savePreference();
        
        if (!enabled) {
            this.stopAmbient();
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.emotionalVolume = this.volume * 1.4; // Emotional moments slightly louder
    }
    
    // Piece-specific voice tones
    generatePieceVoice(piece) {
        // Generate unique voice characteristics based on personality
        const baseFrequency = 200 + (piece.id.charCodeAt(0) * 2);
        const personality = piece.personality;
        
        const voiceProfile = {
            frequency: baseFrequency,
            type: 'sine',
            duration: 0.1
        };
        
        // Modify based on emotional state
        if (piece.emotionalState === 'anxious') {
            voiceProfile.frequency *= 1.2;
            voiceProfile.vibrato = true;
        } else if (piece.emotionalState === 'shutdown') {
            voiceProfile.frequency *= 0.7;
            voiceProfile.duration = 0.3;
        } else if (piece.emotionalState === 'fight') {
            voiceProfile.frequency *= 0.8;
            voiceProfile.type = 'sawtooth';
        }
        
        return voiceProfile;
    }
    
    playPieceSpeak(piece) {
        if (!this.enabled) return;
        
        const voice = this.generatePieceVoice(piece);
        
        // Play short "speech" pattern
        const syllables = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < syllables; i++) {
            setTimeout(() => {
                this.playTone(
                    voice.frequency * (0.9 + Math.random() * 0.2),
                    voice,
                    this.context.currentTime,
                    0.3
                );
            }, i * 100);
        }
    }
}

// Export singleton
export const audioManager = new AudioManager();

// Sound effect helpers
export const sfx = {
    move: (emotion) => audioManager.play('move', { variant: emotion }),
    capture: (feeling) => audioManager.play('capture', { variant: feeling }),
    trustGain: (amount) => audioManager.play('trust_up', { trustChange: amount }),
    trustLoss: (amount) => audioManager.play('trust_down', { trustChange: amount }),
    dysregulation: (type) => audioManager.play('dysregulation', { variant: type }),
    empathySuccess: () => audioManager.play('empathy', { variant: 'success' }),
    empathyFail: () => audioManager.play('empathy', { variant: 'failure' }),
    empathyPerfect: () => audioManager.play('empathy', { variant: 'perfect' }),
    breakthrough: () => audioManager.playBreakthroughSequence(),
    stormWarning: () => audioManager.play('storm', { variant: 'warning' }),
    pieceSpeak: (piece) => audioManager.playPieceSpeak(piece)
};