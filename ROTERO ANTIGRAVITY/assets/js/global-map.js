/**
 * ROTERO Global Connectivity Map - PREMIUM VERSION
 * Ported from React/Framer-Motion implementation to Vanilla JS
 */

class WorldMap {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = {
            lineColor: options.lineColor || '#0ea5e9',
            dots: options.dots || [],
            showLabels: true,
            animationDuration: 3000,
            ...options
        };

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" class="w-full h-full opacity-0 transition-opacity duration-1000">
                <defs>
                    <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="white" stop-opacity="0" />
                        <stop offset="5%" stop-color="${this.options.lineColor}" stop-opacity="1" />
                        <stop offset="95%" stop-color="${this.options.lineColor}" stop-opacity="1" />
                        <stop offset="100%" stop-color="white" stop-opacity="0" />
                    </linearGradient>
                    
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <!-- World Dot Mask (Pre-calculated for performance) -->
                <g id="map-world-dots" class="map-dots" fill="rgba(255,255,127,0.15)"></g>
                <g id="map-routes"></g>
                <g id="map-points"></g>
            </svg>
        `;

        this.svg = this.container.querySelector('svg');
        this.drawWorldPattern();
        this.drawLogistics();

        // Final fade in
        requestAnimationFrame(() => this.svg.classList.remove('opacity-0'));
    }

    // Generates a dotted pattern that actually looks like the world
    drawWorldPattern() {
        const group = this.svg.querySelector('#map-world-dots');
        // Simple longitude/latitude grid with "land mass" probability
        // Optimization: Hardcoding specific regions for better "world" look
        for (let x = 0; x < 800; x += 8) {
            for (let y = 0; y < 400; y += 8) {
                let isLand = false;

                // Simplified continent bounding boxes
                if (x > 120 && x < 280 && y > 60 && y < 320) isLand = Math.random() < 0.7; // Americas
                if (x > 400 && x < 720 && y > 40 && y < 280) isLand = Math.random() < 0.7; // Eurasia/Africa
                if (x > 640 && x < 760 && y > 280 && y < 360) isLand = Math.random() < 0.7; // Australia

                if (isLand) {
                    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    dot.setAttribute("cx", x);
                    dot.setAttribute("cy", y);
                    dot.setAttribute("r", 0.8);
                    group.appendChild(dot);
                }
            }
        }
    }

    projectPoint(lat, lng) {
        const x = (lng + 180) * (800 / 360);
        const y = (90 - lat) * (400 / 180);
        return { x, y };
    }

    createCurvedPath(start, end) {
        const midX = (start.x + end.x) / 2;
        const midY = Math.min(start.y, end.y) - 60;
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    }

    drawLogistics() {
        const routesGroup = this.svg.querySelector('#map-routes');
        const pointsGroup = this.svg.querySelector('#map-points');

        this.options.dots.forEach((dot, i) => {
            const start = this.projectPoint(dot.start.lat, dot.start.lng);
            const end = this.projectPoint(dot.end.lat, dot.end.lng);
            const pathD = this.createCurvedPath(start, end);

            // 1. Draw Route Path with drawing animation
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathD);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "url(#path-gradient)");
            path.setAttribute("stroke-width", "1.2");
            path.setAttribute("class", "map-route-animated");
            path.style.setProperty('--delay', `${i * 0.4}s`);
            routesGroup.appendChild(path);

            // 2. Moving Flow Indicator (Package)
            const follower = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            follower.setAttribute("r", "2.5");
            follower.setAttribute("fill", this.options.lineColor);
            follower.setAttribute("filter", "url(#glow)");

            const animateMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
            animateMotion.setAttribute("dur", "4s");
            animateMotion.setAttribute("begin", `${i * 0.4}s`);
            animateMotion.setAttribute("repeatCount", "indefinite");
            animateMotion.setAttribute("path", pathD);
            follower.appendChild(animateMotion);
            routesGroup.appendChild(follower);

            // 3. Draw Points
            this.createPort(pointsGroup, start, dot.start.label, i, true);
            this.createPort(pointsGroup, end, dot.end.label, i, false);
        });
    }

    createPort(group, pos, label, index, isStart) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Static Dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", pos.x);
        dot.setAttribute("cy", pos.y);
        dot.setAttribute("r", "3");
        dot.setAttribute("fill", this.options.lineColor);
        dot.setAttribute("filter", "url(#glow)");
        g.appendChild(dot);

        // Pulse Animation
        const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pulse.setAttribute("cx", pos.x);
        pulse.setAttribute("cy", pos.y);
        pulse.setAttribute("r", "3");
        pulse.setAttribute("fill", this.options.lineColor);
        pulse.setAttribute("opacity", "0.6");

        const animR = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animR.setAttribute("attributeName", "r");
        animR.setAttribute("from", "3");
        animR.setAttribute("to", "10");
        animR.setAttribute("dur", "2s");
        animR.setAttribute("begin", `${isStart ? '0s' : '0.5s'}`);
        animR.setAttribute("repeatCount", "indefinite");

        const animO = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animO.setAttribute("attributeName", "opacity");
        animO.setAttribute("from", "0.6");
        animO.setAttribute("to", "0");
        animO.setAttribute("dur", "2s");
        animO.setAttribute("begin", `${isStart ? '0s' : '0.5s'}`);
        animO.setAttribute("repeatCount", "indefinite");

        pulse.appendChild(animR);
        pulse.appendChild(animO);
        g.appendChild(pulse);

        // Label
        if (label) {
            const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
            foreign.setAttribute("x", pos.x - 50);
            foreign.setAttribute("y", pos.y - 35);
            foreign.setAttribute("width", "100");
            foreign.setAttribute("height", "30");

            foreign.innerHTML = `
                <div xmlns="http://www.w3.org/1999/xhtml" class="flex items-center justify-center h-full">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-white border border-white/10 shadow-lg whitespace-nowrap">
                        ${label}
                    </span>
                </div>
            `;
            g.appendChild(foreign);
        }

        group.appendChild(g);
    }
}

// Initial Data for ROTERO Ports
const roteroRoutes = [
    { start: { lat: 19.05, lng: -104.33, label: 'MANZANILLO' }, end: { lat: 31.23, lng: 121.47, label: 'SHANGHAI' } },
    { start: { lat: 19.17, lng: -96.13, label: 'VERACRUZ' }, end: { lat: 51.92, lng: 4.47, label: 'ROTTERDAM' } },
    { start: { lat: 22.38, lng: -97.93, label: 'ALTAMIRA' }, end: { lat: 33.72, lng: -118.26, label: 'LOS ANGELES' } },
    { start: { lat: 19.05, lng: -104.33, label: 'MANZANILLO' }, end: { lat: 1.35, lng: 103.81, label: 'SINGAPORE' } }
];

document.addEventListener('DOMContentLoaded', () => {
    new WorldMap('world-map-container', {
        dots: roteroRoutes,
        lineColor: '#3b82f6'
    });
});
