// Performance optimization for smooth emotional gameplay
export class PerformanceOptimizer {
    constructor() {
        this.frameTarget = 60;
        this.frameTime = 1000 / this.frameTarget;
        this.performanceMode = this.detectPerformanceMode();
        this.activeAnimations = new Set();
        this.renderQueue = [];
        this.lastFrameTime = 0;
        
        this.initializeOptimizations();
        this.startMonitoring();
    }
    
    detectPerformanceMode() {
        // Check device capabilities
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const gpu = this.detectGPU();
        
        // Mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Performance scoring
        let score = 0;
        score += memory >= 8 ? 3 : memory >= 4 ? 2 : 1;
        score += cores >= 8 ? 3 : cores >= 4 ? 2 : 1;
        score += gpu.tier === 'high' ? 3 : gpu.tier === 'medium' ? 2 : 1;
        score -= isMobile ? 2 : 0;
        
        // Determine mode
        if (score >= 8) return 'ultra';
        if (score >= 6) return 'high';
        if (score >= 4) return 'medium';
        return 'low';
    }
    
    detectGPU() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { tier: 'low', renderer: 'unknown' };
        }
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
        
        // Simple GPU tier detection
        const highEndKeywords = ['NVIDIA', 'Radeon RX', 'GeForce RTX', 'GeForce GTX 10', 'GeForce GTX 16'];
        const isHighEnd = highEndKeywords.some(keyword => renderer.includes(keyword));
        
        return {
            tier: isHighEnd ? 'high' : renderer !== 'unknown' ? 'medium' : 'low',
            renderer: renderer
        };
    }
    
    initializeOptimizations() {
        // Apply performance-based settings
        this.settings = this.getSettingsForMode(this.performanceMode);
        
        // CSS optimizations
        this.applyCSSOptimizations();
        
        // Canvas optimizations if used
        this.setupCanvasOptimizations();
        
        // Request idle callback for non-critical updates
        this.setupIdleCallbacks();
    }
    
    getSettingsForMode(mode) {
        const settings = {
            ultra: {
                particles: { max: 100, quality: 'high' },
                animations: { complex: true, duration: 'normal' },
                effects: { blur: true, shadows: true, glow: true },
                emotionalParticles: true,
                weatherEffects: 'full',
                transitionDuration: 300,
                updateFrequency: 16 // ~60fps
            },
            high: {
                particles: { max: 50, quality: 'medium' },
                animations: { complex: true, duration: 'normal' },
                effects: { blur: true, shadows: true, glow: true },
                emotionalParticles: true,
                weatherEffects: 'full',
                transitionDuration: 300,
                updateFrequency: 16
            },
            medium: {
                particles: { max: 25, quality: 'low' },
                animations: { complex: false, duration: 'fast' },
                effects: { blur: false, shadows: true, glow: false },
                emotionalParticles: true,
                weatherEffects: 'simplified',
                transitionDuration: 200,
                updateFrequency: 33 // ~30fps
            },
            low: {
                particles: { max: 10, quality: 'minimal' },
                animations: { complex: false, duration: 'instant' },
                effects: { blur: false, shadows: false, glow: false },
                emotionalParticles: false,
                weatherEffects: 'minimal',
                transitionDuration: 0,
                updateFrequency: 50 // ~20fps
            }
        };
        
        return settings[mode];
    }
    
    applyCSSOptimizations() {
        const style = document.createElement('style');
        style.id = 'performance-optimizations';
        
        let css = '';
        
        // Reduce animation complexity for lower modes
        if (this.performanceMode === 'low') {
            css += `
                * {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                }
                .particle, .emotional-particle {
                    display: none !important;
                }
            `;
        } else if (this.performanceMode === 'medium') {
            css += `
                * {
                    animation-duration: calc(var(--animation-duration, 1s) * 0.5) !important;
                    transition-duration: calc(var(--transition-duration, 0.3s) * 0.5) !important;
                }
                .blur-effect {
                    filter: none !important;
                }
            `;
        }
        
        // Hardware acceleration for transforms
        css += `
            .piece, .animated-element {
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .board {
                transform: translate3d(0, 0, 0);
            }
        `;
        
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    setupCanvasOptimizations() {
        // If using canvas for particle effects
        this.offscreenCanvas = null;
        
        if ('OffscreenCanvas' in window && this.performanceMode !== 'low') {
            // Setup offscreen canvas for particle rendering
            this.offscreenCanvas = new OffscreenCanvas(800, 800);
            this.offscreenContext = this.offscreenCanvas.getContext('2d');
        }
    }
    
    setupIdleCallbacks() {
        // Non-critical updates during idle time
        this.idleQueue = [];
        
        if ('requestIdleCallback' in window) {
            this.scheduleIdleWork = (callback) => {
                requestIdleCallback(callback, { timeout: 1000 });
            };
        } else {
            // Fallback
            this.scheduleIdleWork = (callback) => {
                setTimeout(callback, 100);
            };
        }
    }
    
    // Performance monitoring
    startMonitoring() {
        this.frameCount = 0;
        this.frameTimes = [];
        this.monitoring = true;
        
        this.monitorFrame();
    }
    
    monitorFrame(timestamp = 0) {
        if (!this.monitoring) return;
        
        // Calculate frame time
        if (this.lastFrameTime) {
            const frameTime = timestamp - this.lastFrameTime;
            this.frameTimes.push(frameTime);
            
            // Keep last 60 frames
            if (this.frameTimes.length > 60) {
                this.frameTimes.shift();
            }
            
            // Check if we need to adjust quality
            if (this.frameCount % 60 === 0) {
                this.adjustQuality();
            }
        }
        
        this.lastFrameTime = timestamp;
        this.frameCount++;
        
        requestAnimationFrame((ts) => this.monitorFrame(ts));
    }
    
    adjustQuality() {
        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        const fps = 1000 / avgFrameTime;
        
        // Auto-adjust quality if FPS is too low
        if (fps < 25 && this.performanceMode !== 'low') {
            console.log('Performance: Reducing quality due to low FPS:', fps);
            this.downgradePerformance();
        } else if (fps > 55 && this.performanceMode !== 'ultra') {
            // Consider upgrading if consistently high FPS
            this.considerUpgrade();
        }
    }
    
    downgradePerformance() {
        const modes = ['ultra', 'high', 'medium', 'low'];
        const currentIndex = modes.indexOf(this.performanceMode);
        
        if (currentIndex < modes.length - 1) {
            this.performanceMode = modes[currentIndex + 1];
            this.settings = this.getSettingsForMode(this.performanceMode);
            this.applyPerformanceMode();
            
            // Notify user
            this.notifyPerformanceChange('reduced');
        }
    }
    
    considerUpgrade() {
        // Only upgrade if we've been stable for a while
        if (!this.upgradeConsiderationStart) {
            this.upgradeConsiderationStart = Date.now();
        }
        
        if (Date.now() - this.upgradeConsiderationStart > 10000) { // 10 seconds
            const modes = ['low', 'medium', 'high', 'ultra'];
            const currentIndex = modes.indexOf(this.performanceMode);
            
            if (currentIndex > 0) {
                this.performanceMode = modes[currentIndex - 1];
                this.settings = this.getSettingsForMode(this.performanceMode);
                this.applyPerformanceMode();
                
                this.notifyPerformanceChange('improved');
            }
            
            this.upgradeConsiderationStart = null;
        }
    }
    
    applyPerformanceMode() {
        // Update all active effects
        document.body.setAttribute('data-performance', this.performanceMode);
        
        // Update particle systems
        if (window.particleManager) {
            window.particleManager.setMaxParticles(this.settings.particles.max);
        }
        
        // Update animation durations
        document.documentElement.style.setProperty(
            '--animation-duration', 
            this.settings.transitionDuration + 'ms'
        );
    }
    
    // Render queue management
    queueRender(element, updates, priority = 'normal') {
        const task = {
            element,
            updates,
            priority,
            timestamp: Date.now()
        };
        
        if (priority === 'high') {
            this.renderQueue.unshift(task);
        } else {
            this.renderQueue.push(task);
        }
        
        this.processRenderQueue();
    }
    
    processRenderQueue() {
        if (this.processingQueue) return;
        
        this.processingQueue = true;
        
        requestAnimationFrame(() => {
            const startTime = performance.now();
            const frameDeadline = startTime + this.frameTime * 0.8; // Use 80% of frame budget
            
            while (this.renderQueue.length > 0 && performance.now() < frameDeadline) {
                const task = this.renderQueue.shift();
                this.applyUpdates(task.element, task.updates);
            }
            
            this.processingQueue = false;
            
            if (this.renderQueue.length > 0) {
                this.processRenderQueue();
            }
        });
    }
    
    applyUpdates(element, updates) {
        // Batch DOM updates
        if (updates.styles) {
            Object.assign(element.style, updates.styles);
        }
        
        if (updates.classes) {
            if (updates.classes.add) {
                element.classList.add(...updates.classes.add);
            }
            if (updates.classes.remove) {
                element.classList.remove(...updates.classes.remove);
            }
        }
        
        if (updates.attributes) {
            Object.entries(updates.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
    }
    
    // Animation optimization
    registerAnimation(animationId, element) {
        this.activeAnimations.add({
            id: animationId,
            element: element,
            startTime: Date.now()
        });
        
        // Limit concurrent animations in low performance mode
        if (this.performanceMode === 'low' && this.activeAnimations.size > 3) {
            const oldest = Array.from(this.activeAnimations)[0];
            this.cancelAnimation(oldest.id);
        }
    }
    
    unregisterAnimation(animationId) {
        this.activeAnimations.forEach(anim => {
            if (anim.id === animationId) {
                this.activeAnimations.delete(anim);
            }
        });
    }
    
    cancelAnimation(animationId) {
        this.activeAnimations.forEach(anim => {
            if (anim.id === animationId) {
                // Skip to end state
                anim.element.style.animation = 'none';
                this.activeAnimations.delete(anim);
            }
        });
    }
    
    // Particle optimization
    createParticlePool(size = 100) {
        this.particlePool = [];
        this.activeParticles = new Set();
        
        for (let i = 0; i < size; i++) {
            const particle = document.createElement('div');
            particle.className = 'pooled-particle';
            particle.style.position = 'absolute';
            particle.style.display = 'none';
            document.body.appendChild(particle);
            
            this.particlePool.push(particle);
        }
    }
    
    getParticle() {
        if (this.particlePool.length === 0) {
            // Reuse oldest active particle if pool is empty
            if (this.activeParticles.size > 0) {
                const oldest = Array.from(this.activeParticles)[0];
                this.releaseParticle(oldest);
            } else {
                return null; // No particles available
            }
        }
        
        const particle = this.particlePool.pop();
        this.activeParticles.add(particle);
        particle.style.display = 'block';
        return particle;
    }
    
    releaseParticle(particle) {
        particle.style.display = 'none';
        particle.className = 'pooled-particle'; // Reset classes
        this.activeParticles.delete(particle);
        this.particlePool.push(particle);
    }
    
    // Memory management
    cleanupUnusedAssets() {
        // Schedule cleanup during idle time
        this.scheduleIdleWork(() => {
            // Remove offscreen elements
            const pieces = document.querySelectorAll('.piece');
            pieces.forEach(piece => {
                const rect = piece.getBoundingClientRect();
                if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
                    piece.style.visibility = 'hidden';
                } else {
                    piece.style.visibility = 'visible';
                }
            });
            
            // Clear old particle references
            if (this.activeParticles.size === 0 && this.particlePool.length > 50) {
                // Reduce pool size
                const excess = this.particlePool.splice(50);
                excess.forEach(p => p.remove());
            }
            
            // Clear animation cache
            this.activeAnimations.forEach(anim => {
                if (Date.now() - anim.startTime > 10000) { // 10 seconds old
                    this.unregisterAnimation(anim.id);
                }
            });
        });
    }
    
    // User preference handling
    setUserPreference(setting, value) {
        if (setting === 'performance') {
            this.performanceMode = value;
            this.settings = this.getSettingsForMode(value);
            this.applyPerformanceMode();
            
            // Save preference
            localStorage.setItem('chesstropia_performance', value);
        }
    }
    
    notifyPerformanceChange(direction) {
        // Create subtle notification
        const notification = document.createElement('div');
        notification.className = 'performance-notification';
        notification.textContent = direction === 'reduced' 
            ? 'Reducing effects for smoother gameplay' 
            : 'Enhanced effects enabled';
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Cleanup
    destroy() {
        this.monitoring = false;
        
        // Remove all particles
        this.activeParticles.forEach(p => p.remove());
        this.particlePool.forEach(p => p.remove());
        
        // Clear queues
        this.renderQueue = [];
        this.idleQueue = [];
        
        // Remove style optimizations
        const style = document.getElementById('performance-optimizations');
        if (style) style.remove();
    }
}

// Export singleton
export const performanceOptimizer = new PerformanceOptimizer();

// Utility exports
export const optimizedRender = (element, updates, priority) => {
    performanceOptimizer.queueRender(element, updates, priority);
};

export const withPerformance = (func) => {
    return performanceOptimizer.throttle(func, performanceOptimizer.settings.updateFrequency);
};