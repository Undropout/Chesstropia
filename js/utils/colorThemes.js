// Emotional color themes that respond to game state
export const colorThemes = {
    // Base emotional palettes
    palettes: {
        // Team-specific color affinities
        amber: {
            name: "Amber Warmth",
            primary: "#F59E0B",
            secondary: "#FCD34D", 
            tertiary: "#FEF3C7",
            accent: "#D97706",
            shadow: "#92400E",
            glow: "#FDE68A",
            meaning: "Abandonment seeking connection"
        },
        
        cyan: {
            name: "Cyan Mask",
            primary: "#06B6D4",
            secondary: "#67E8F9",
            tertiary: "#CFFAFE", 
            accent: "#0891B2",
            shadow: "#164E63",
            glow: "#A5F3FC",
            meaning: "Perfectionism hiding truth"
        },
        
        magenta: {
            name: "Magenta Conflict",
            primary: "#EC4899",
            secondary: "#F9A8D4",
            tertiary: "#FCE7F3",
            accent: "#DB2777",
            shadow: "#831843",
            glow: "#FBCFE8",
            meaning: "Identity torn between worlds"
        },
        
        green: {
            name: "Green Propriety",
            primary: "#10B981",
            secondary: "#6EE7B7",
            tertiary: "#D1FAE5",
            accent: "#059669",
            shadow: "#064E3B",
            glow: "#A7F3D0",
            meaning: "Repression seeking release"
        }
    },
    
    // Emotional state overlays
    emotionalOverlays: {
        anxious: {
            filter: "sepia(0.2) contrast(1.1)",
            animation: "anxious-pulse 2s ease-in-out infinite",
            borderColor: "#F59E0B",
            shadowBlur: 10,
            particles: {
                count: 20,
                speed: 3,
                color: "#FCD34D",
                behavior: "erratic"
            }
        },
        
        shutdown: {
            filter: "grayscale(0.7) brightness(0.8)",
            animation: "shutdown-fade 3s ease-in-out infinite",
            borderColor: "#6B7280",
            shadowBlur: 0,
            particles: {
                count: 5,
                speed: 0.5,
                color: "#9CA3AF",
                behavior: "falling"
            }
        },
        
        fight: {
            filter: "saturate(1.5) contrast(1.2)",
            animation: "fight-shake 0.5s ease-in-out infinite",
            borderColor: "#EF4444",
            shadowBlur: 20,
            particles: {
                count: 30,
                speed: 5,
                color: "#F87171",
                behavior: "explosive"
            }
        },
        
        freeze: {
            filter: "hue-rotate(-20deg) brightness(1.2)",
            animation: "freeze-crystallize 4s ease-in-out infinite",
            borderColor: "#60A5FA",
            shadowBlur: 5,
            particles: {
                count: 15,
                speed: 0.1,
                color: "#BFDBFE",
                behavior: "crystalline"
            }
        },
        
        fawn: {
            filter: "brightness(1.1) contrast(0.9)",
            animation: "fawn-sway 3s ease-in-out infinite",
            borderColor: "#C084FC",
            shadowBlur: 15,
            particles: {
                count: 25,
                speed: 2,
                color: "#E9D5FF",
                behavior: "following"
            }
        },
        
        regulated: {
            filter: "none",
            animation: "regulated-breathe 4s ease-in-out infinite",
            borderColor: "#10B981",
            shadowBlur: 8,
            particles: {
                count: 10,
                speed: 1,
                color: "#6EE7B7",
                behavior: "orbiting"
            }
        }
    },
    
    // Trust level visual representations
    trustVisuals: {
        ranges: [
            { min: -5, max: -3, class: "trust-hostile", color: "#991B1B", glow: false },
            { min: -2, max: -1, class: "trust-wary", color: "#DC2626", glow: false },
            { min: 0, max: 2, class: "trust-neutral", color: "#6B7280", glow: false },
            { min: 3, max: 5, class: "trust-building", color: "#059669", glow: true },
            { min: 6, max: 8, class: "trust-strong", color: "#0891B2", glow: true },
            { min: 9, max: 10, class: "trust-complete", color: "#7C3AED", glow: true }
        ],
        
        getVisual(trustLevel) {
            const range = this.ranges.find(r => trustLevel >= r.min && trustLevel <= r.max);
            return range || this.ranges[2]; // Default to neutral
        }
    },
    
    // Weather/storm effects
    weatherEffects: {
        calm: {
            background: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)",
            filter: "none",
            particles: null
        },
        
        approaching: {
            background: "linear-gradient(180deg, #9CA3AF 0%, #4B5563 100%)",
            filter: "brightness(0.9)",
            particles: {
                type: "dust",
                density: "light",
                color: "#6B7280"
            }
        },
        
        storm: {
            background: "linear-gradient(180deg, #374151 0%, #111827 100%)",
            filter: "brightness(0.7) contrast(1.2)",
            particles: {
                type: "rain",
                density: "heavy",
                color: "#60A5FA"
            },
            lightning: {
                frequency: 5000,
                duration: 200,
                color: "#FBBF24"
            }
        },
        
        aftermath: {
            background: "linear-gradient(180deg, #E5E7EB 0%, #F3F4F6 100%)",
            filter: "brightness(1.1)",
            particles: {
                type: "mist",
                density: "medium",
                color: "#F9FAFB"
            }
        }
    },
    
    // Breakthrough visual effects
    breakthroughEffects: {
        stages: [
            {
                name: "crack",
                duration: 500,
                effect: "radial-gradient(circle, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)"
            },
            {
                name: "shatter",
                duration: 1000,
                effect: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.8), transparent)"
            },
            {
                name: "bloom",
                duration: 2000,
                effect: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 100%)",
                particles: {
                    type: "sparkles",
                    count: 50,
                    colors: ["#FBBF24", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6", "#3B82F6", "#10B981"]
                }
            }
        ]
    },
    
    // Dynamic color mixing based on relationships
    relationshipColors: {
        positive: {
            strong: "#10B981", // Green - healthy bond
            moderate: "#3B82F6", // Blue - growing connection
            weak: "#60A5FA" // Light blue - tentative bond
        },
        
        negative: {
            hostile: "#DC2626", // Red - active conflict
            tense: "#F59E0B", // Orange - friction
            uncomfortable: "#EAB308" // Yellow - unease
        },
        
        neutral: {
            unknown: "#9CA3AF", // Gray - no relationship yet
            distant: "#D1D5DB" // Light gray - acknowledged but distant
        },
        
        special: {
            trauma_bond: "#7C3AED", // Purple - intense shared pain
            healer_patient: "#06B6D4", // Cyan - supportive dynamic
            mirror_wounds: "#EC4899" // Magenta - same trauma recognized
        }
    },
    
    // CSS generation functions
    generateCSS() {
        let css = `
/* Emotion-based animations */
@keyframes anxious-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes shutdown-fade {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.3; }
}

@keyframes fight-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px) rotate(-1deg); }
    75% { transform: translateX(2px) rotate(1deg); }
}

@keyframes freeze-crystallize {
    0% { filter: hue-rotate(-20deg) brightness(1.2); }
    50% { filter: hue-rotate(-30deg) brightness(1.4); }
    100% { filter: hue-rotate(-20deg) brightness(1.2); }
}

@keyframes fawn-sway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
}

@keyframes regulated-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

/* Trust level glows */
.trust-complete {
    box-shadow: 0 0 20px var(--trust-color),
                0 0 40px var(--trust-color),
                0 0 60px var(--trust-color);
}

.trust-strong {
    box-shadow: 0 0 15px var(--trust-color),
                0 0 30px var(--trust-color);
}

.trust-building {
    box-shadow: 0 0 10px var(--trust-color);
}

/* Emotional particle effects */
.particles-anxious {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    opacity: 0.6;
}

/* Storm effects */
.storm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
}

.lightning-flash {
    background: rgba(251, 191, 36, 0.8);
    animation: lightning 0.2s ease-out;
}

@keyframes lightning {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

/* Breakthrough effects */
.breakthrough-shatter {
    animation: shatter 1s ease-out;
}

@keyframes shatter {
    0% { 
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.1);
        filter: brightness(2);
    }
    100% {
        transform: scale(1);
        filter: brightness(1.5);
    }
}

/* Relationship connection lines */
.relationship-line {
    stroke-width: 2;
    fill: none;
    opacity: 0.6;
}

.relationship-line.positive-strong {
    stroke: #10B981;
    stroke-width: 3;
    opacity: 0.8;
}

.relationship-line.trauma-bond {
    stroke: #7C3AED;
    stroke-dasharray: 5, 5;
    animation: pulse-line 2s infinite;
}

@keyframes pulse-line {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}
`;
        
        return css;
    },
    
    // Color mixing utilities
    mixColors(color1, color2, ratio = 0.5) {
        // Parse hex colors
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        // Mix RGB values
        const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
        const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
        const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);
        
        return this.rgbToHex(r, g, b);
    },
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Apply theme to piece
    applyPieceTheme(element, piece, teamColor) {
        const emotionalOverlay = this.emotionalOverlays[piece.emotionalState] || this.emotionalOverlays.regulated;
        const trustVisual = this.trustVisuals.getVisual(piece.trust);
        const palette = this.palettes[teamColor];
        
        // Base color from team affinity
        element.style.setProperty('--piece-color', palette.primary);
        element.style.setProperty('--piece-glow', palette.glow);
        
        // Emotional state overlay
        element.style.filter = emotionalOverlay.filter;
        element.style.animation = emotionalOverlay.animation;
        element.style.borderColor = emotionalOverlay.borderColor;
        
        // Trust-based modifications
        element.style.setProperty('--trust-color', trustVisual.color);
        element.classList.add(trustVisual.class);
        
        // Breakthrough state
        if (piece.hasBreakthrough) {
            element.classList.add('breakthrough-achieved');
            element.style.setProperty('--breakthrough-glow', 'rgba(255,255,255,0.5)');
        }
        
        return element;
    },
    
    // Environmental theming
    applyEnvironmentTheme(container, weather, teamColor) {
        const weatherEffect = this.weatherEffects[weather];
        const palette = this.palettes[teamColor];
        
        container.style.background = weatherEffect.background;
        container.style.filter = weatherEffect.filter;
        
        // Add weather particles if needed
        if (weatherEffect.particles) {
            this.createWeatherParticles(container, weatherEffect.particles);
        }
        
        // Add team color accents
        container.style.setProperty('--team-primary', palette.primary);
        container.style.setProperty('--team-secondary', palette.secondary);
        container.style.setProperty('--team-accent', palette.accent);
        
        return container;
    },
    
    // Particle system for emotional effects
    createEmotionalParticles(container, emotionalState) {
        const config = this.emotionalOverlays[emotionalState].particles;
        if (!config) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = `particles-${emotionalState}`;
        
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = config.color;
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Apply behavior
            this.animateParticle(particle, config);
            
            particleContainer.appendChild(particle);
        }
        
        container.appendChild(particleContainer);
    },
    
    animateParticle(particle, config) {
        let animation;
        
        switch(config.behavior) {
            case 'erratic':
                animation = `erratic-move ${3 + Math.random() * 2}s infinite`;
                break;
            case 'falling':
                animation = `fall ${5 + Math.random() * 3}s infinite`;
                break;
            case 'explosive':
                animation = `explode ${1 + Math.random()}s ease-out`;
                break;
            case 'crystalline':
                animation = `crystallize ${4 + Math.random() * 2}s infinite`;
                break;
            case 'following':
                animation = `follow ${2 + Math.random()}s infinite`;
                break;
            case 'orbiting':
                animation = `orbit ${4 + Math.random() * 2}s infinite`;
                break;
        }
        
        particle.style.animation = animation;
    },
    
    // Relationship visualization
    drawRelationshipLine(svg, piece1, piece2, relationshipType) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        const relationship = this.getRelationshipColor(relationshipType);
        
        line.setAttribute('x1', piece1.x);
        line.setAttribute('y1', piece1.y);
        line.setAttribute('x2', piece2.x);
        line.setAttribute('y2', piece2.y);
        line.setAttribute('class', `relationship-line ${relationship.class}`);
        line.style.stroke = relationship.color;
        
        svg.appendChild(line);
        
        return line;
    },
    
    getRelationshipColor(value) {
        if (value > 7) return { color: this.relationshipColors.positive.strong, class: 'positive-strong' };
        if (value > 4) return { color: this.relationshipColors.positive.moderate, class: 'positive-moderate' };
        if (value > 1) return { color: this.relationshipColors.positive.weak, class: 'positive-weak' };
        if (value > -2) return { color: this.relationshipColors.neutral.unknown, class: 'neutral' };
        if (value > -4) return { color: this.relationshipColors.negative.uncomfortable, class: 'negative-uncomfortable' };
        if (value > -7) return { color: this.relationshipColors.negative.tense, class: 'negative-tense' };
        return { color: this.relationshipColors.negative.hostile, class: 'negative-hostile' };
    }
};

// Dynamic theme manager
export class ThemeManager {
    constructor() {
        this.currentTheme = 'amber';
        this.weatherState = 'calm';
        this.activeEffects = new Set();
        
        this.injectStyles();
    }
    
    injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'chesstropia-themes';
        styleSheet.textContent = colorThemes.generateCSS();
        document.head.appendChild(styleSheet);
    }
    
    setTeamTheme(teamColorAffinity) {
        this.currentTheme = teamColorAffinity;
        document.body.style.setProperty('--team-theme', teamColorAffinity);
        
        // Update all themed elements
        document.querySelectorAll('[data-theme]').forEach(element => {
            this.updateElementTheme(element);
        });
    }
    
    updateElementTheme(element) {
        const palette = colorThemes.palettes[this.currentTheme];
        if (!palette) return;
        
        Object.entries(palette).forEach(([key, value]) => {
            if (key !== 'name' && key !== 'meaning') {
                element.style.setProperty(`--theme-${key}`, value);
            }
        });
    }
    
    setWeather(weatherState) {
        this.weatherState = weatherState;
        const container = document.getElementById('game-container');
        if (container) {
            colorThemes.applyEnvironmentTheme(container, weatherState, this.currentTheme);
        }
        
        // Handle special weather effects
        if (weatherState === 'storm' && !this.stormInterval) {
            this.startStormEffects();
        } else if (weatherState !== 'storm' && this.stormInterval) {
            this.stopStormEffects();
        }
    }
    
    startStormEffects() {
        const overlay = document.createElement('div');
        overlay.className = 'storm-overlay';
        document.body.appendChild(overlay);
        
        // Random lightning
        this.stormInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                overlay.classList.add('lightning-flash');
                setTimeout(() => overlay.classList.remove('lightning-flash'), 200);
            }
        }, 3000);
    }
    
    stopStormEffects() {
        if (this.stormInterval) {
            clearInterval(this.stormInterval);
            this.stormInterval = null;
        }
        
        const overlay = document.querySelector('.storm-overlay');
        if (overlay) overlay.remove();
    }
    
    applyBreakthroughEffect(element) {
        const stages = colorThemes.breakthroughEffects.stages;
        
        stages.forEach((stage, index) => {
            setTimeout(() => {
                element.style.background = stage.effect;
                element.classList.add(`breakthrough-${stage.name}`);
                
                if (stage.particles) {
                    this.createBreakthroughParticles(element, stage.particles);
                }
            }, stages.slice(0, index).reduce((sum, s) => sum + s.duration, 0));
        });
    }
    
    createBreakthroughParticles(element, config) {
        const container = document.createElement('div');
        container.className = 'breakthrough-particles';
        
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'breakthrough-particle';
            particle.style.backgroundColor = config.colors[Math.floor(Math.random() * config.colors.length)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            // Explode outward
            const angle = (i / config.count) * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            particle.style.transform = `translate(-50%, -50%) 
                                       translate(${Math.cos(angle) * distance}px, 
                                               ${Math.sin(angle) * distance}px) 
                                       scale(${0.5 + Math.random() * 0.5})`;
            particle.style.opacity = '0';
            particle.style.transition = 'all 2s ease-out';
            
            container.appendChild(particle);
        }
        
        element.appendChild(container);
        
        // Trigger animation
        requestAnimationFrame(() => {
            container.querySelectorAll('.breakthrough-particle').forEach(p => {
                p.style.opacity = '1';
            });
        });
        
        // Cleanup
        setTimeout(() => container.remove(), 2000);
    }
}

// Export singleton
export const themeManager = new ThemeManager();