// Animação Sofisticada de Conexões Comunitárias - Campanha Seropédica
class CommunityNetworkAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.connections = [];
        this.nodes = [];
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.time = 0;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createNetwork();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            opacity: 0.8;
        `;

        const heroBanner = document.querySelector('.hero-banner');
        heroBanner.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNetwork() {
        // Criar nós distribuídos por todo o hero-banner
        const nodeCount = Math.min(12, Math.floor(window.innerWidth / 100));

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 2 + Math.random() * 6,
                pulsePhase: Math.random() * Math.PI * 2,
                connections: [],
                brightness: 0.3 + Math.random() * 0.7
            });
        }

        // Criar partículas flutuantes
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: 1 + Math.random() * 3,
                opacity: 0.2 + Math.random() * 0.6,
                hue: 120 + Math.random() * 30, // Verdes
                pulseSpeed: 0.01 + Math.random() * 0.02
            });
        }

        // Criar conexões entre nós próximos
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 250) {
                    this.connections.push({
                        from: i,
                        to: j,
                        strength: Math.max(0, 1 - distance / 250)
                    });
                }
            }
        }
    }

    
    getDistance(node1, node2) {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.nodes = [];
            this.flowLines = [];
            this.createNetwork();
        });

        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
    }

    updateElements() {
        // Atualizar nós
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Borda suave
            const margin = 30;
            if (node.x < margin || node.x > this.canvas.width - margin) {
                node.vx *= -0.8;
                node.x = Math.max(margin, Math.min(this.canvas.width - margin, node.x));
            }
            if (node.y < margin || node.y > this.canvas.height - margin) {
                node.vy *= -0.8;
                node.y = Math.max(margin, Math.min(this.canvas.height - margin, node.y));
            }

            // Movimento orgânico
            node.vx += (Math.random() - 0.5) * 0.03;
            node.vy += (Math.random() - 0.5) * 0.03;
            node.vx *= 0.98;
            node.vy *= 0.98;

            // Interação com mouse
            const dx = this.mousePosition.x - node.x;
            const dy = this.mousePosition.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const force = (120 - distance) / 120;
                node.vx -= (dx / distance) * force * 0.08;
                node.vy -= (dy / distance) * force * 0.08;
            }
        });

        // Atualizar partículas
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wraparound nas bordas
            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = this.canvas.height + 10;
            if (particle.y > this.canvas.height + 10) particle.y = -10;

            // Movimento suave
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawElements() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenhar conexões
        this.connections.forEach(connection => {
            const fromNode = this.nodes[connection.from];
            const toNode = this.nodes[connection.to];

            const gradient = this.ctx.createLinearGradient(
                fromNode.x, fromNode.y,
                toNode.x, toNode.y
            );
            gradient.addColorStop(0, `rgba(34, 197, 94, ${connection.strength * 0.2})`);
            gradient.addColorStop(0.5, `rgba(34, 197, 94, ${connection.strength * 0.4})`);
            gradient.addColorStop(1, `rgba(34, 197, 94, ${connection.strength * 0.2})`);

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = connection.strength * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(fromNode.x, fromNode.y);
            this.ctx.lineTo(toNode.x, toNode.y);
            this.ctx.stroke();
        });

        // Desenhar partículas flutuantes
        this.particles.forEach(particle => {
            const pulse = Math.sin(this.time * particle.pulseSpeed) * 0.3 + 0.7;

            // Brilho da partícula
            const glowGradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 3
            );
            glowGradient.addColorStop(0, `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * pulse})`);
            glowGradient.addColorStop(1, `hsla(${particle.hue}, 70%, 50%, 0)`);

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Partícula principal
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * pulse})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Desenhar nós
        this.nodes.forEach(node => {
            const pulseSize = Math.sin(this.time * 0.002 + node.pulsePhase) * 1.5;
            const radius = node.radius + pulseSize;

            // Brilho do nó
            const glowGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 3
            );
            glowGradient.addColorStop(0, `rgba(34, 197, 94, ${0.4 * node.brightness})`);
            glowGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Nó principal
            this.ctx.fillStyle = `rgba(22, 163, 74, ${node.brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Centro do nó
            this.ctx.fillStyle = `rgba(240, 253, 244, ${node.brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.time++;
        this.updateElements();
        this.drawElements();
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar animação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CommunityNetworkAnimation();
});