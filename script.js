// ExoAI Explorer - Professional Futuristic Interface
class ExoAIExplorer {
    constructor() {
        this.starMap = null;
        this.brightnessChart = null;
        this.stars = [];
        this.nasaData = [];
        this.aiPredictions = new Map();
        this.currentSection = '';
        this.user = null;
        this.achievements = [];
        this.tourMode = false;
        this.uploadedData = null;
        this.userStats = {
            analyses: 0,
            discoveries: 0,
            starsExplored: 0,
            uploads: 0,
            xp: 0
        };
        this.leaderboard = [];
        this.tourStep = 0;
        this.init();
    }

    init() {
        this.createStarMap();
        this.createBrightnessChart();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupActiveNavigation();
        this.addLoadingAnimations();
        this.loadInitialData();
        this.initializeGamification();
    }

    // 3D Starfield Implementation with Three.js
    createStarMap() {
        const container = document.getElementById('starfield3d');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Camera position (third-person view)
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);

        // Create starfield
        this.createStarfield();
        
        // Add controls
        this.addCameraControls();
        
        // Start animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize(container);
        });
    }

    createStarfield() {
        const numStars = 2500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(numStars * 3);
        const colors = new Float32Array(numStars * 3);
        const sizes = new Float32Array(numStars);
        const starData = [];
        
        // Create star texture/sprite
        const starTexture = this.createStarTexture();
        
        // Generate random star positions in a sphere
        for (let i = 0; i < numStars; i++) {
            const i3 = i * 3;
            
            // Random position in sphere (more stars near center)
            const radius = Math.pow(Math.random(), 0.7) * 200 + 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Realistic star colors and brightness
            const starType = Math.random();
            let color, brightness, size;
            
            if (starType < 0.2) {
                // Blue stars (hot, massive)
                color = new THREE.Color(0.6, 0.8, 1.0);
                brightness = 0.8 + Math.random() * 0.2;
                size = 1.8 + Math.random() * 1.2;
            } else if (starType < 0.6) {
                // White stars (main sequence)
                color = new THREE.Color(1.0, 1.0, 1.0);
                brightness = 0.6 + Math.random() * 0.3;
                size = 1.2 + Math.random() * 1.0;
            } else if (starType < 0.9) {
                // Yellowish stars (like our Sun)
                color = new THREE.Color(1.0, 0.95, 0.8);
                brightness = 0.4 + Math.random() * 0.4;
                size = 1.0 + Math.random() * 1.2;
            } else {
                // Orange/red stars (cooler)
                color = new THREE.Color(1.0, 0.7, 0.5);
                brightness = 0.2 + Math.random() * 0.3;
                size = 0.8 + Math.random() * 1.0;
            }
            
            // Apply distance-based dimming
            const distanceFactor = Math.max(0.3, 1 - (radius - 10) / 200);
            brightness *= distanceFactor;
            size *= distanceFactor;
            
            colors[i3] = color.r * brightness;
            colors[i3 + 1] = color.g * brightness;
            colors[i3 + 2] = color.b * brightness;
            sizes[i] = size;
            
            // Store star data for interaction
            starData.push({
                name: this.generateStarName(),
                brightness: Math.round(brightness * 100),
                type: starType < 0.2 ? 'Blue Star' : starType < 0.6 ? 'White Star' : starType < 0.9 ? 'Yellow Star' : 'Orange Star',
                position: new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material with star texture and enhanced effects
        const material = new THREE.PointsMaterial({
            map: starTexture,
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.1
        });
        
        this.starfield = new THREE.Points(geometry, material);
        this.scene.add(this.starfield);
        
        // Store data for interaction
        this.starPositions = positions;
        this.starSizes = sizes;
        this.starColors = colors;
        this.starData = starData;
        
        // Add click detection
        this.addStarInteraction();
    }

    createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Create radial gradient for star glow
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    generateStarName() {
        const number = Math.floor(Math.random() * 9999) + 1;
        return `Star-${number}`;
    }

    addStarInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.starfield);
            
            if (intersects.length > 0) {
                const starIndex = intersects[0].index;
                const starInfo = this.starData[starIndex];
                this.showStarInfo(starInfo, event.clientX, event.clientY);
                this.trackStarExploration();
            }
        });
        
        // Add hover effect
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.starfield);
            
            if (intersects.length > 0) {
                this.renderer.domElement.style.cursor = 'pointer';
                } else {
                this.renderer.domElement.style.cursor = 'grab';
            }
        });
    }

    showStarInfo(starInfo, x, y) {
        // Remove existing info card
        const existingCard = document.querySelector('.star-info-card');
        if (existingCard) {
            existingCard.remove();
        }
        
        const card = document.createElement('div');
        card.className = 'star-info-card';
        card.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 12px;
            padding: 16px;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            max-width: 220px;
            animation: fadeInUp 0.3s ease-out;
        `;
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 8px; height: 8px; background: #00d4ff; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);"></div>
                <h3 style="margin: 0; color: #00d4ff; font-size: 16px; font-weight: 600;">${starInfo.name}</h3>
            </div>
            <div style="margin-bottom: 4px;">
                <span style="color: #888;">Type:</span> 
                <span style="color: white; font-weight: 500;">${starInfo.type}</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color: #888;">Brightness:</span> 
                <span style="color: #ffd700; font-weight: 600;">${starInfo.brightness}%</span>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(0, 212, 255, 0.2);
                border: 1px solid rgba(0, 212, 255, 0.3);
                color: #00d4ff;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(0, 212, 255, 0.3)'" onmouseout="this.style.background='rgba(0, 212, 255, 0.2)'">
                Close
            </button>
        `;
        
        document.body.appendChild(card);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (card.parentElement) {
                card.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => card.remove(), 300);
            }
        }, 5000);
    }

    addCameraControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3;
        this.controls.minDistance = 15;
        this.controls.maxDistance = 150;
        this.controls.enableRotate = true;
        this.controls.rotateSpeed = 0.5;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Twinkling animation
        if (this.starfield) {
            this.updateTwinkling();
        }
        
        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    updateTwinkling() {
        const time = Date.now() * 0.001;
        const colors = this.starfield.geometry.attributes.color.array;
        const sizes = this.starfield.geometry.attributes.size.array;
        
        for (let i = 0; i < colors.length; i += 3) {
            const starIndex = i / 3;
            const starData = this.starData[starIndex];
            
            // More realistic twinkling with different speeds for different star types
            let twinkleSpeed, twinkleIntensity;
            
            if (starData.type === 'Blue Star') {
                twinkleSpeed = 1.0 + Math.random() * 1.5;
                twinkleIntensity = 0.12;
            } else if (starData.type === 'White Star') {
                twinkleSpeed = 0.8 + Math.random() * 1.2;
                twinkleIntensity = 0.15;
            } else if (starData.type === 'Yellow Star') {
                twinkleSpeed = 0.5 + Math.random() * 0.8;
                twinkleIntensity = 0.2;
            } else {
                twinkleSpeed = 0.3 + Math.random() * 0.5;
                twinkleIntensity = 0.25;
            }
            
            const twinklePhase = starIndex * 0.1;
            const twinkle = Math.sin(time * twinkleSpeed + twinklePhase) * twinkleIntensity + (1 - twinkleIntensity);
            
            // Update color brightness
            colors[i] *= twinkle;
            colors[i + 1] *= twinkle;
            colors[i + 2] *= twinkle;
            
            // Subtle size variation
            const sizeVariation = Math.sin(time * twinkleSpeed * 0.5 + twinklePhase) * 0.1 + 0.9;
            sizes[starIndex] = this.starSizes[starIndex] * sizeVariation;
        }
        
        this.starfield.geometry.attributes.color.needsUpdate = true;
        this.starfield.geometry.attributes.size.needsUpdate = true;
    }

    handleResize(container) {
        if (!this.camera || !this.renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Brightness Curves Implementation (Enhanced)
    createBrightnessChart() {
        const canvas = document.getElementById('brightnessChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.generateBrightnessData();
        
        this.brightnessChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Star Brightness',
                    data: data.values,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#00d4ff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#00d4ff',
                    pointHoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: { size: 14, weight: 'bold' }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (hours)',
                            color: '#00d4ff',
                            font: { size: 14, weight: 'bold' }
                        },
                        ticks: { color: '#cccccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Brightness (%)',
                            color: '#00d4ff',
                            font: { size: 14, weight: 'bold' }
                        },
                        ticks: { color: '#cccccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    generateBrightnessData() {
        const labels = [];
        const values = [];
        
        for (let i = 0; i < 24; i++) {
            labels.push(`${i}:00`);
            const baseBrightness = 50 + 30 * Math.sin(i * Math.PI / 12) + Math.random() * 10 - 5;
            values.push(Math.max(0, Math.min(100, baseBrightness)));
        }
        
        return { labels, values };
    }

    // NASA Data Integration (Enhanced with Confidence Bars)
    async loadNasaData() {
        const loadBtn = document.getElementById('loadNasaDataBtn');
        const tableBody = document.getElementById('nasaDataBody');
        
        if (!loadBtn || !tableBody) return;

        // Show loading state
        loadBtn.innerHTML = '<span class="loading-spinner"></span> Loading NASA Data...';
        loadBtn.disabled = true;
        
        tableBody.innerHTML = '<tr><td colspan="7" class="data-loading"><span class="loading-spinner"></span> Fetching exoplanet data from NASA...</td></tr>';

        try {
            await this.simulateNasaApiCall();
            this.populateNasaTable();
            this.updatePlanetCards();
            this.showNotification('NASA data loaded successfully!', 'success');
            this.trackUpload();
        } catch (error) {
            console.error('Error loading NASA data:', error);
            tableBody.innerHTML = '<tr><td colspan="7" class="data-loading text-red-400">Failed to load NASA data. Please try again.</td></tr>';
            this.showNotification('Failed to load NASA data', 'error');
        } finally {
            loadBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Load NASA Data</span>';
            loadBtn.disabled = false;
        }
    }

    async simulateNasaApiCall() {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.nasaData = [
            {
                planetName: 'Kepler-452b',
                hostStar: 'Kepler-452',
                orbitalPeriod: 384.8,
                planetRadius: 1.63,
                transitDuration: 7.2,
                status: 'Confirmed',
                discoveryYear: 2015
            },
            {
                planetName: 'TRAPPIST-1e',
                hostStar: 'TRAPPIST-1',
                orbitalPeriod: 6.1,
                planetRadius: 0.92,
                transitDuration: 2.4,
                status: 'Confirmed',
                discoveryYear: 2017
            },
            {
                planetName: 'Proxima Centauri b',
                hostStar: 'Proxima Centauri',
                orbitalPeriod: 11.2,
                planetRadius: 1.27,
                transitDuration: 3.8,
                status: 'Confirmed',
                discoveryYear: 2016
            },
            {
                planetName: 'HD 40307g',
                hostStar: 'HD 40307',
                orbitalPeriod: 197.8,
                planetRadius: 2.2,
                transitDuration: 8.5,
                status: 'Confirmed',
                discoveryYear: 2012
            },
            {
                planetName: 'Gliese 667Cc',
                hostStar: 'Gliese 667C',
                orbitalPeriod: 28.1,
                planetRadius: 1.54,
                transitDuration: 4.2,
                status: 'Confirmed',
                discoveryYear: 2011
            },
            {
                planetName: 'Wolf 1061c',
                hostStar: 'Wolf 1061',
                orbitalPeriod: 17.9,
                planetRadius: 1.64,
                transitDuration: 3.1,
                status: 'Confirmed',
                discoveryYear: 2015
            },
            {
                planetName: 'TOI-715b',
                hostStar: 'TOI-715',
                orbitalPeriod: 19.3,
                planetRadius: 1.55,
                transitDuration: 2.8,
                status: 'Candidate',
                discoveryYear: 2023
            },
            {
                planetName: 'K2-18b',
                hostStar: 'K2-18',
                orbitalPeriod: 32.9,
                planetRadius: 2.37,
                transitDuration: 5.1,
                status: 'Confirmed',
                discoveryYear: 2015
            },
            {
                planetName: 'LHS 1140b',
                hostStar: 'LHS 1140',
                orbitalPeriod: 24.7,
                planetRadius: 1.43,
                transitDuration: 3.9,
                status: 'Confirmed',
                discoveryYear: 2017
            },
            {
                planetName: 'Ross 128b',
                hostStar: 'Ross 128',
                orbitalPeriod: 9.9,
                planetRadius: 1.35,
                transitDuration: 2.1,
                status: 'Confirmed',
                discoveryYear: 2017
            }
        ];
    }

    populateNasaTable() {
        const tableBody = document.getElementById('nasaDataBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.nasaData.forEach((planet, index) => {
            const row = document.createElement('tr');
            row.className = 'loading';
            
            const aiPrediction = this.generateAIPrediction(planet);
            const confidence = this.generateConfidence(planet, aiPrediction);
            this.aiPredictions.set(planet.planetName, { prediction: aiPrediction, confidence });
            
            row.innerHTML = `
                <td class="px-6 py-4 font-semibold text-white">${planet.planetName}</td>
                <td class="px-6 py-4 text-gray-300">${planet.hostStar}</td>
                <td class="px-6 py-4 text-gray-300">${planet.orbitalPeriod.toFixed(1)}</td>
                <td class="px-6 py-4 text-gray-300">${planet.planetRadius.toFixed(2)}</td>
                <td class="px-6 py-4 text-gray-300">${planet.transitDuration.toFixed(1)}</td>
                <td class="px-6 py-4"><span class="status-${planet.status.toLowerCase().replace(' ', '-')}">${planet.status}</span></td>
                <td class="px-6 py-4">
                    <div class="confidence-container">
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="--confidence: ${confidence}%"></div>
                        </div>
                        <div class="confidence-label text-xs font-semibold text-neon-cyan">${confidence}% ${aiPrediction}</div>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
            
            setTimeout(() => {
                row.classList.add('loading');
            }, index * 100);
        });
    }

    updatePlanetCards() {
        const container = document.getElementById('planetCards');
        if (!container) return;

        container.innerHTML = '';

        this.nasaData.forEach((planet, index) => {
            const aiData = this.aiPredictions.get(planet.planetName);
            
            const card = document.createElement('div');
            card.className = 'planet-card nasa-data loading';
            
            card.innerHTML = `
                <h3 class="planet-name">${planet.planetName}</h3>
                <div class="planet-info">
                    <div class="planet-info-item">
                        <span class="planet-info-label">Host Star:</span>
                        <span class="planet-info-value">${planet.hostStar}</span>
                    </div>
                    <div class="planet-info-item">
                        <span class="planet-info-label">Radius:</span>
                        <span class="planet-info-value">${planet.planetRadius.toFixed(2)} Earth radii</span>
                    </div>
                    <div class="planet-info-item">
                        <span class="planet-info-label">Orbital Period:</span>
                        <span class="planet-info-value">${planet.orbitalPeriod.toFixed(1)} days</span>
                    </div>
                    <div class="planet-info-item">
                        <span class="planet-info-label">Transit Duration:</span>
                        <span class="planet-info-value">${planet.transitDuration.toFixed(1)} hours</span>
                    </div>
                    <div class="planet-info-item">
                        <span class="planet-info-label">Status:</span>
                        <span class="planet-info-value status-${planet.status.toLowerCase().replace(' ', '-')}">${planet.status}</span>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="text-sm text-gray-400 mb-2">AI Prediction:</div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="--confidence: ${aiData.confidence}%"></div>
                    </div>
                    <div class="confidence-label text-xs font-semibold text-neon-cyan">${aiData.confidence}% ${aiData.prediction}</div>
                </div>
            `;
            
            container.appendChild(card);
            
            setTimeout(() => {
                card.classList.add('loading');
            }, index * 150);
        });
    }

    // Enhanced AI Prediction System
    generateAIPrediction(planet) {
        const predictions = ['Confirmed', 'Candidate', 'False Positive'];
        let weights = [0.4, 0.4, 0.2];
        
        if (planet.status === 'Confirmed') {
            weights = [0.7, 0.2, 0.1];
        } else if (planet.status === 'Candidate') {
            weights = [0.3, 0.5, 0.2];
        }
        
        if (planet.planetRadius < 1.0) {
            weights[0] *= 0.8;
            weights[1] *= 1.2;
        }
        
        if (planet.orbitalPeriod < 5) {
            weights[2] *= 1.5;
        }
        
        const total = weights.reduce((sum, w) => sum + w, 0);
        weights = weights.map(w => w / total);
        
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < predictions.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return predictions[i];
            }
        }
        
        return predictions[0];
    }

    generateConfidence(planet, prediction) {
        let baseConfidence = 75;
        
        // Adjust based on planet characteristics
        if (planet.status === 'Confirmed') {
            baseConfidence += 15;
        } else if (planet.status === 'Candidate') {
            baseConfidence += 5;
        }
        
        if (planet.planetRadius > 1.5) {
            baseConfidence += 10; // Larger planets easier to detect
        } else if (planet.planetRadius < 1.0) {
            baseConfidence -= 15; // Smaller planets harder to detect
        }
        
        if (planet.orbitalPeriod > 30) {
            baseConfidence += 5; // Longer periods more stable
        } else if (planet.orbitalPeriod < 10) {
            baseConfidence -= 10; // Very short periods might be false positives
        }
        
        // Add some randomness
        baseConfidence += (Math.random() - 0.5) * 20;
        
        return Math.max(45, Math.min(95, Math.round(baseConfidence)));
    }

    async performAIAnalysis() {
        const analyzeBtn = document.getElementById('analyzeAllBtn');
        if (!analyzeBtn) return;

        if (this.nasaData.length === 0) {
            this.showNotification('Please load NASA data first', 'warning');
            return;
        }

        analyzeBtn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
        analyzeBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update all predictions
        this.nasaData.forEach(planet => {
            const newPrediction = this.generateAIPrediction(planet);
            const newConfidence = this.generateConfidence(planet, newPrediction);
            this.aiPredictions.set(planet.planetName, { prediction: newPrediction, confidence: newConfidence });
            
            // Track planet discovery if it's confirmed
            if (newPrediction === 'Confirmed' && newConfidence > 80) {
                this.trackDiscovery();
            }
        });

        this.updateTablePredictions();
        this.updateCardPredictions();

        analyzeBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg><span>Analysis Complete!</span>';
        analyzeBtn.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.3))';
        analyzeBtn.style.borderColor = 'rgba(16, 185, 129, 0.5)';

        this.showNotification('AI analysis completed! Predictions updated.', 'success');

        setTimeout(() => {
            analyzeBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg><span>Analyze with AI</span>';
            analyzeBtn.disabled = false;
            analyzeBtn.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))';
            analyzeBtn.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        }, 3000);
    }

    updateTablePredictions() {
        const tableRows = document.querySelectorAll('#nasaDataBody tr');
        tableRows.forEach((row, index) => {
            if (this.nasaData[index]) {
                const planet = this.nasaData[index];
                const aiData = this.aiPredictions.get(planet.planetName);
                const predictionCell = row.querySelector('.confidence-container');
                if (predictionCell) {
                    predictionCell.innerHTML = `
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="--confidence: ${aiData.confidence}%"></div>
                        </div>
                        <div class="confidence-label text-xs font-semibold text-neon-cyan">${aiData.confidence}% ${aiData.prediction}</div>
                    `;
                }
            }
        });
    }

    updateCardPredictions() {
        const cards = document.querySelectorAll('.planet-card.nasa-data');
        cards.forEach((card, index) => {
            if (this.nasaData[index]) {
                const planet = this.nasaData[index];
                const aiData = this.aiPredictions.get(planet.planetName);
                const predictionElement = card.querySelector('.confidence-bar').parentElement;
                if (predictionElement) {
                    predictionElement.innerHTML = `
                        <div class="text-sm text-gray-400 mb-2">AI Prediction:</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="--confidence: ${aiData.confidence}%"></div>
                        </div>
                        <div class="confidence-label text-xs font-semibold text-neon-cyan">${aiData.confidence}% ${aiData.prediction}</div>
                    `;
                }
            }
        });
    }

    // Intersection Observer for Smooth Animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    // Active Navigation Highlighting
    setupActiveNavigation() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateActiveNav();
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
            info: '<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                ${icons[type]}
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Original Brightness Analysis (Preserved)
    performOriginalAIAnalysis() {
        const btn = document.getElementById('analyzeBtn');
        if (!btn) return;

        btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Analysis Complete!</span>';
            btn.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.3))';
            btn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            
            this.showAnalysisResults();
            
            setTimeout(() => {
                btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg><span>Analyze with AI</span>';
                btn.disabled = false;
                btn.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))';
                btn.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            }, 3000);
        }, 2000);
    }

    showAnalysisResults() {
        const results = document.createElement('div');
        results.className = 'glass-card fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 p-8 max-w-lg';
        results.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        `;
        
        results.innerHTML = `
            <h3 class="text-2xl font-bold text-neon-cyan mb-4 text-center">AI Analysis Results</h3>
            <div class="space-y-3 text-center">
                <p class="text-gray-300">Detected <span class="text-neon-cyan font-semibold">3 potential exoplanet transits</span></p>
                <p class="text-gray-300">Confidence level: <span class="text-green-400 font-semibold">87.3%</span></p>
                <p class="text-gray-300">Recommended follow-up observations</p>
            </div>
            <button onclick="this.parentElement.remove()" class="glass-button mt-6 px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 w-full">
                Close
            </button>
        `;
        
        document.body.appendChild(results);
        
        setTimeout(() => {
            if (results.parentElement) {
                results.remove();
            }
        }, 8000);
    }

    // Event Listeners
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // NASA Data button
        const loadNasaBtn = document.getElementById('loadNasaDataBtn');
        if (loadNasaBtn) {
            loadNasaBtn.addEventListener('click', () => {
                this.loadNasaData();
            });
        }

        // AI Analysis button
        const analyzeAllBtn = document.getElementById('analyzeAllBtn');
        if (analyzeAllBtn) {
            analyzeAllBtn.addEventListener('click', () => {
                this.performAIAnalysis();
                this.trackAnalysis();
            });
        }

        // Original brightness curve analysis button
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.performOriginalAIAnalysis();
                this.trackAnalysis();
            });
        }
    }

    loadInitialData() {
        this.nasaData = [
            {
                planetName: 'Kepler-452b',
                hostStar: 'Kepler-452',
                orbitalPeriod: 384.8,
                planetRadius: 1.63,
                transitDuration: 7.2,
                status: 'Confirmed',
                discoveryYear: 2015
            },
            {
                planetName: 'TRAPPIST-1e',
                hostStar: 'TRAPPIST-1',
                orbitalPeriod: 6.1,
                planetRadius: 0.92,
                transitDuration: 2.4,
                status: 'Confirmed',
                discoveryYear: 2017
            },
            {
                planetName: 'Proxima Centauri b',
                hostStar: 'Proxima Centauri',
                orbitalPeriod: 11.2,
                planetRadius: 1.27,
                transitDuration: 3.8,
                status: 'Confirmed',
                discoveryYear: 2016
            }
        ];
        
        this.updatePlanetCards();
    }

    addLoadingAnimations() {
        document.querySelectorAll('.loading').forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Gamification System
    initializeGamification() {
        this.loadUserStats();
        this.initializeAchievements();
        this.initializeLeaderboard();
        this.updateProgressBars();
        this.showXPDisplay();
        this.setupGamificationEventListeners();
    }

    initializeAchievements() {
        this.achievements = [
            { 
                id: 'first_analysis', 
                name: 'Data Scientist', 
                description: 'Run your first AI analysis',
                icon: '🔬',
                xp: 50,
                unlocked: false,
                condition: () => this.userStats.analyses >= 1
            },
            { 
                id: 'nasa_explorer', 
                name: 'NASA Collaborator', 
                description: 'Load NASA exoplanet data',
                icon: '🛰️',
                xp: 75,
                unlocked: false,
                condition: () => this.userStats.analyses >= 1
            },
            { 
                id: 'star_gazer', 
                name: 'Star Gazer', 
                description: 'Explore 10 stars',
                icon: '⭐',
                xp: 100,
                unlocked: false,
                condition: () => this.userStats.starsExplored >= 10
            },
            { 
                id: 'planet_hunter', 
                name: 'Planet Hunter', 
                description: 'Discover 5 planets',
                icon: '🪐',
                xp: 150,
                unlocked: false,
                condition: () => this.userStats.discoveries >= 5
            },
            { 
                id: 'data_uploader', 
                name: 'Data Uploader', 
                description: 'Upload 3 datasets',
                icon: '📊',
                xp: 75,
                unlocked: false,
                condition: () => this.userStats.uploads >= 3
            },
            { 
                id: 'ai_master', 
                name: 'AI Master', 
                description: 'Run 10 AI analyses',
                icon: '🤖',
                xp: 200,
                unlocked: false,
                condition: () => this.userStats.analyses >= 10
            },
            { 
                id: 'space_tourist', 
                name: 'Space Tourist', 
                description: 'Complete a space tour',
                icon: '🚀',
                xp: 100,
                unlocked: false,
                condition: () => this.tourStep > 0
            }
        ];
        
        this.loadAchievements();
        this.updateAchievementsDisplay();
    }

    initializeLeaderboard() {
        this.leaderboard = [
            { name: 'AstroExplorer', analyses: 15, discoveries: 8, xp: 1250 },
            { name: 'StarHunter', analyses: 12, discoveries: 6, xp: 980 },
            { name: 'PlanetSeeker', analyses: 10, discoveries: 5, xp: 850 },
            { name: 'DataMaster', analyses: 8, discoveries: 4, xp: 720 },
            { name: 'CosmicVoyager', analyses: 6, discoveries: 3, xp: 580 },
            { name: 'SpaceExplorer', analyses: 4, discoveries: 2, xp: 420 },
            { name: 'GalaxyGazer', analyses: 3, discoveries: 1, xp: 320 },
            { name: 'You', analyses: this.userStats.analyses, discoveries: this.userStats.discoveries, xp: this.userStats.xp }
        ];
        
        this.leaderboard.sort((a, b) => b.xp - a.xp);
        this.updateLeaderboardDisplay();
    }

    updateAchievementsDisplay() {
        const container = document.getElementById('achievementsList');
        if (!container) return;
        
        container.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}" 
                 data-tooltip="${achievement.description}">
                <div class="achievement-icon">
                    <span class="text-xl">${achievement.icon}</span>
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
                <div class="achievement-xp">+${achievement.xp} XP</div>
            </div>
        `).join('');
        
        // Add tooltip functionality
        container.querySelectorAll('.achievement-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            item.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    updateLeaderboardDisplay() {
        const container = document.getElementById('leaderboardList');
        if (!container) return;
        
        container.innerHTML = this.leaderboard.slice(0, 7).map((user, index) => `
            <div class="leaderboard-item ${user.name === 'You' ? 'current-user' : ''}">
                <div class="leaderboard-rank ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">
                    ${index + 1}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-stats">${user.analyses} analyses • ${user.discoveries} discoveries</div>
                </div>
                <div class="leaderboard-score">${user.xp} XP</div>
            </div>
        `).join('');
    }

    updateProgressBars() {
        const progressData = [
            { id: 'analysis', current: this.userStats.analyses, max: 10 },
            { id: 'discovery', current: this.userStats.discoveries, max: 25 },
            { id: 'star', current: this.userStats.starsExplored, max: 50 },
            { id: 'upload', current: this.userStats.uploads, max: 5 }
        ];
        
        progressData.forEach(data => {
            const percentage = Math.min((data.current / data.max) * 100, 100);
            const progressElement = document.getElementById(`${data.id}Progress`);
            const fillElement = document.getElementById(`${data.id}ProgressFill`);
            
            if (progressElement && fillElement) {
                progressElement.textContent = `${data.current}/${data.max}`;
                fillElement.style.setProperty('--progress', `${percentage}%`);
                fillElement.style.width = `${percentage}%`;
            }
        });
    }

    showXPDisplay() {
        const existingDisplay = document.querySelector('.xp-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        const xpDisplay = document.createElement('div');
        xpDisplay.className = 'xp-display';
        xpDisplay.innerHTML = `
            <div class="xp-label">Total XP</div>
            <div class="xp-value">${this.userStats.xp}</div>
        `;
        
        document.body.appendChild(xpDisplay);
    }

    awardXP(amount, reason) {
        this.userStats.xp += amount;
        this.showXPDisplay();
        this.saveUserStats();
        
        // Show XP notification
        this.showNotification(`+${amount} XP - ${reason}`, 'success');
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.awardXP(achievement.xp, `Achievement: ${achievement.name}`);
        this.showAchievementNotification(achievement);
        this.updateAchievementsDisplay();
        this.saveAchievements();
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h3>🏆 Achievement Unlocked!</h3>
            <p><strong>${achievement.name}</strong></p>
            <p>${achievement.description}</p>
            <div class="xp-reward">
                <span>+${achievement.xp} XP</span>
            </div>
            <button onclick="this.parentElement.remove()" class="glass-button px-4 py-2 rounded-lg">
                Awesome!
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    startSpaceTour() {
        this.tourMode = true;
        this.tourStep = 0;
        this.showTourOverlay();
        this.nextTourStep();
    }

    showTourOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tour-mode';
        overlay.id = 'tourOverlay';
        document.body.appendChild(overlay);
    }

    nextTourStep() {
        const tourSteps = [
            {
                target: '#star-map-section',
                title: 'Welcome to ExoAI Explorer!',
                content: 'This is your 3D star map. Click and drag to explore the cosmos!',
                action: 'Next'
            },
            {
                target: '#brightness-curves-section',
                title: 'Brightness Analysis',
                content: 'Here you can analyze star brightness curves to detect exoplanets.',
                action: 'Next'
            },
            {
                target: '#nasa-data-section',
                title: 'NASA Data Integration',
                content: 'Load real NASA exoplanet data and compare with AI predictions.',
                action: 'Next'
            },
            {
                target: '#planet-profiles-section',
                title: 'Planet Profiles',
                content: 'View detailed information about discovered exoplanets.',
                action: 'Next'
            },
            {
                target: '#gamification-section',
                title: 'Achievements & Progress',
                content: 'Track your progress and unlock achievements as you explore!',
                action: 'Finish Tour'
            }
        ];
        
        if (this.tourStep < tourSteps.length) {
            const step = tourSteps[this.tourStep];
            this.showTourTooltip(step);
            this.tourStep++;
        } else {
            this.endTour();
        }
    }

    showTourTooltip(step) {
        const targetElement = document.querySelector(step.target);
        if (!targetElement) return;
        
        const rect = targetElement.getBoundingClientRect();
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 20}px`;
        tooltip.innerHTML = `
            <h4>${step.title}</h4>
            <p>${step.content}</p>
            <button onclick="window.exoAI.nextTourStep()">${step.action}</button>
        `;
        
        document.body.appendChild(tooltip);
        
        // Highlight target
        const highlight = document.createElement('div');
        highlight.className = 'tour-highlight';
        highlight.style.left = `${rect.left - 10}px`;
        highlight.style.top = `${rect.top - 10}px`;
        highlight.style.width = `${rect.width + 20}px`;
        highlight.style.height = `${rect.height + 20}px`;
        
        document.body.appendChild(highlight);
        
        // Scroll to target
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    endTour() {
        this.tourMode = false;
        document.getElementById('tourOverlay')?.remove();
        document.querySelectorAll('.tour-tooltip, .tour-highlight').forEach(el => el.remove());
        
        // Award tour completion achievement
        const tourAchievement = this.achievements.find(a => a.id === 'space_tourist');
        if (tourAchievement && !tourAchievement.unlocked) {
            this.unlockAchievement(tourAchievement);
        }
        
        this.showNotification('Space tour completed! Welcome to ExoAI Explorer!', 'success');
    }

    // Event tracking methods
    trackAnalysis() {
        this.userStats.analyses++;
        this.awardXP(25, 'AI Analysis Complete');
        this.updateProgressBars();
        this.checkAchievements();
        this.saveUserStats();
    }

    trackDiscovery() {
        this.userStats.discoveries++;
        this.awardXP(50, 'Planet Discovered');
        this.updateProgressBars();
        this.checkAchievements();
        this.saveUserStats();
    }

    trackStarExploration() {
        this.userStats.starsExplored++;
        this.awardXP(10, 'Star Explored');
        this.updateProgressBars();
        this.checkAchievements();
        this.saveUserStats();
    }

    trackUpload() {
        this.userStats.uploads++;
        this.awardXP(30, 'Data Uploaded');
        this.updateProgressBars();
        this.checkAchievements();
        this.saveUserStats();
    }

    // Storage methods
    saveUserStats() {
        localStorage.setItem('exoai_userStats', JSON.stringify(this.userStats));
    }

    loadUserStats() {
        const saved = localStorage.getItem('exoai_userStats');
        if (saved) {
            this.userStats = { ...this.userStats, ...JSON.parse(saved) };
        }
    }

    saveAchievements() {
        localStorage.setItem('exoai_achievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('exoai_achievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            this.achievements.forEach(achievement => {
                const saved = savedAchievements.find(a => a.id === achievement.id);
                if (saved) {
                    achievement.unlocked = saved.unlocked;
                }
            });
        }
    }

    // Utility methods
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;
        
        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());
    }

    setupGamificationEventListeners() {
        // Space tour button
        const startTourBtn = document.getElementById('startTourBtn');
        if (startTourBtn) {
            startTourBtn.addEventListener('click', () => this.startSpaceTour());
        }
        
        // 3D Space Tour buttons
        const toggle3DTourBtn = document.getElementById('toggle3DTourBtn');
        const exit3DTourBtn = document.getElementById('exit3DTourBtn');
        const closeSpaceTourInfo = document.getElementById('closeSpaceTourInfo');
        
        if (toggle3DTourBtn) {
            toggle3DTourBtn.addEventListener('click', () => this.start3DSpaceTour());
        }
        
        if (exit3DTourBtn) {
            exit3DTourBtn.addEventListener('click', () => this.exit3DSpaceTour());
        }
        
        if (closeSpaceTourInfo) {
            closeSpaceTourInfo.addEventListener('click', () => this.closeSpaceTourInfo());
        }
    }

    // 3D Space Tour System
    start3DSpaceTour() {
        this.spaceTour3D = new SpaceTour3D();
        this.spaceTour3D.init();
        this.show3DTourOverlay();
        this.trackStarExploration(); // Award XP for starting 3D tour
    }

    exit3DSpaceTour() {
        if (this.spaceTour3D) {
            this.spaceTour3D.destroy();
            this.spaceTour3D = null;
        }
        this.hide3DTourOverlay();
    }

    show3DTourOverlay() {
        const overlay = document.getElementById('spaceTour3D');
        if (overlay) {
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hide3DTourOverlay() {
        const overlay = document.getElementById('spaceTour3D');
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    closeSpaceTourInfo() {
        const infoPanel = document.getElementById('spaceTourInfoPanel');
        if (infoPanel) {
            infoPanel.classList.add('hidden');
        }
    }

}

// 3D Space Tour Class
class SpaceTour3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.stars = [];
        this.planets = [];
        this.nebula = null;
        this.spaceDust = null;
        this.selectedObject = null;
        this.animationId = null;
        this.clock = new THREE.Clock();
        this.fpsCounter = 0;
        this.lastTime = 0;
        this.objectCount = 0;
        
        // Real star data (simplified NASA Kepler/TESS data)
        this.starData = [
            { name: 'Kepler-452', type: 'G2V', brightness: 1.04, distance: 1400, planets: 1, color: 0xFFFFAA },
            { name: 'Kepler-186', type: 'M1V', brightness: 0.04, distance: 500, planets: 5, color: 0xFF4444 },
            { name: 'Kepler-442', type: 'K5V', brightness: 0.41, distance: 1200, planets: 1, color: 0xFF8844 },
            { name: 'Kepler-62', type: 'K2V', brightness: 0.21, distance: 1200, planets: 5, color: 0xFF6644 },
            { name: 'Kepler-22', type: 'G5V', brightness: 0.97, distance: 600, planets: 1, color: 0xFFFF88 },
            { name: 'Kepler-438', type: 'M3V', brightness: 0.08, distance: 470, planets: 1, color: 0xFF3333 },
            { name: 'Kepler-442b', type: 'K5V', brightness: 0.41, distance: 1200, planets: 1, color: 0xFF8844 },
            { name: 'Kepler-1649', type: 'M5V', brightness: 0.02, distance: 300, planets: 2, color: 0xFF2222 },
            { name: 'Kepler-155', type: 'K7V', brightness: 0.15, distance: 800, planets: 2, color: 0xFF5533 },
            { name: 'Kepler-296', type: 'M2V', brightness: 0.06, distance: 400, planets: 5, color: 0xFF3333 }
        ];
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLighting();
        this.createStarField();
        this.createPlanets();
        this.createNebula();
        this.createSpaceDust();
        this.setupEventListeners();
        this.animate();
        this.updatePerformanceStats();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }

    createCamera() {
        const container = document.getElementById('spaceTour3DCanvas');
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            10000
        );
        this.camera.position.set(0, 0, 100);
    }

    createRenderer() {
        const container = document.getElementById('spaceTour3DCanvas');
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
    }

    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.maxDistance = 1000;
        this.controls.minDistance = 10;
    }

    createLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        this.scene.add(ambientLight);

        // Directional light for stars
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(100, 100, 100);
        this.scene.add(directionalLight);
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });

        const starPositions = [];
        const starColors = [];
        const starSizes = [];

        // Create background stars
        for (let i = 0; i < 2000; i++) {
            const radius = Math.random() * 2000 + 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            starPositions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            const brightness = Math.random() * 0.5 + 0.5;
            starColors.push(brightness, brightness, brightness);
            starSizes.push(Math.random() * 2 + 1);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);

        // Create interactive stars with real data
        this.starData.forEach((starInfo, index) => {
            const star = this.createInteractiveStar(starInfo, index);
            this.stars.push(star);
            this.scene.add(star);
        });
    }

    createInteractiveStar(starInfo, index) {
        const geometry = new THREE.SphereGeometry(starInfo.brightness * 2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: starInfo.color,
            transparent: true,
            opacity: 0.8
        });

        const star = new THREE.Mesh(geometry, material);
        
        // Position stars in a realistic distribution
        const radius = starInfo.distance * 0.1;
        const theta = (index / this.starData.length) * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        star.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(starInfo.brightness * 3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: starInfo.color,
            transparent: true,
            opacity: 0.1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        star.add(glow);

        // Store star information
        star.userData = {
            type: 'star',
            name: starInfo.name,
            starType: starInfo.type,
            brightness: starInfo.brightness,
            distance: starInfo.distance,
            planets: starInfo.planets,
            color: starInfo.color
        };

        return star;
    }

    createPlanets() {
        this.starData.forEach((starInfo, starIndex) => {
            if (starInfo.planets > 0) {
                const star = this.stars[starIndex];
                for (let i = 0; i < starInfo.planets; i++) {
                    const planet = this.createPlanet(star, i, starInfo);
                    this.planets.push(planet);
                    this.scene.add(planet);
                }
            }
        });
    }

    createPlanet(hostStar, planetIndex, starInfo) {
        const planetTypes = ['rocky', 'gas', 'ice'];
        const planetType = planetTypes[planetIndex % planetTypes.length];
        
        let geometry, material, color;
        
        switch (planetType) {
            case 'rocky':
                geometry = new THREE.SphereGeometry(0.5, 8, 8);
                color = 0x8B4513;
                break;
            case 'gas':
                geometry = new THREE.SphereGeometry(1.2, 8, 8);
                color = 0x4169E1;
                break;
            case 'ice':
                geometry = new THREE.SphereGeometry(0.8, 8, 8);
                color = 0x87CEEB;
                break;
        }

        material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });

        const planet = new THREE.Mesh(geometry, material);
        
        // Position planet in orbit around star
        const orbitRadius = 5 + planetIndex * 3;
        const orbitSpeed = 0.01 + Math.random() * 0.02;
        
        planet.userData = {
            type: 'planet',
            name: `${starInfo.name}-${planetIndex + 1}`,
            planetType: planetType,
            orbitRadius: orbitRadius,
            orbitSpeed: orbitSpeed,
            hostStar: hostStar,
            orbitalPeriod: Math.round(365 * orbitRadius / 10),
            size: geometry.parameters.radius,
            aiConfidence: Math.random() * 30 + 70 // 70-100% confidence
        };

        // Set initial position
        planet.position.copy(hostStar.position);
        planet.position.x += orbitRadius;

        return planet;
    }

    createNebula() {
        const nebulaGeometry = new THREE.PlaneGeometry(1000, 1000);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: 0x4400AA,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });

        this.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        this.nebula.position.set(0, 0, -500);
        this.scene.add(this.nebula);
    }

    createSpaceDust() {
        const dustGeometry = new THREE.BufferGeometry();
        const dustMaterial = new THREE.PointsMaterial({
            color: 0x888888,
            size: 0.1,
            transparent: true,
            opacity: 0.3
        });

        const dustPositions = [];
        for (let i = 0; i < 1000; i++) {
            dustPositions.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
        }

        dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
        this.spaceDust = new THREE.Points(dustGeometry, dustMaterial);
        this.scene.add(this.spaceDust);
    }

    setupEventListeners() {
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseClick(event) {
        const mouse = new THREE.Vector2();
        const rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const objects = [...this.stars, ...this.planets];
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            this.deselectObject();
        }
    }

    onMouseMove(event) {
        const mouse = new THREE.Vector2();
        const rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const objects = [...this.stars, ...this.planets];
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            this.renderer.domElement.style.cursor = 'pointer';
        } else {
            this.renderer.domElement.style.cursor = 'grab';
        }
    }

    selectObject(object) {
        this.selectedObject = object;
        this.showObjectInfo(object);
    }

    deselectObject() {
        this.selectedObject = null;
        this.hideObjectInfo();
    }

    showObjectInfo(object) {
        const infoPanel = document.getElementById('spaceTourInfoPanel');
        const objectName = document.getElementById('spaceTourObjectName');
        const objectDetails = document.getElementById('spaceTourObjectDetails');

        if (object.userData.type === 'star') {
            objectName.textContent = object.userData.name;
            objectDetails.innerHTML = `
                <div class="flex justify-between">
                    <span class="text-gray-400">Type:</span>
                    <span class="text-white">${object.userData.starType}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Brightness:</span>
                    <span class="text-neon-cyan">${object.userData.brightness.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Distance:</span>
                    <span class="text-white">${object.userData.distance} ly</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Planets:</span>
                    <span class="text-neon-cyan">${object.userData.planets}</span>
                </div>
            `;
        } else if (object.userData.type === 'planet') {
            objectName.textContent = object.userData.name;
            objectDetails.innerHTML = `
                <div class="flex justify-between">
                    <span class="text-gray-400">Type:</span>
                    <span class="text-white">${object.userData.planetType}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Size:</span>
                    <span class="text-neon-cyan">${object.userData.size.toFixed(1)}x Earth</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Orbital Period:</span>
                    <span class="text-white">${object.userData.orbitalPeriod} days</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">AI Confidence:</span>
                    <span class="text-neon-cyan">${object.userData.aiConfidence.toFixed(0)}%</span>
                </div>
            `;
        }

        infoPanel.classList.remove('hidden');
    }

    hideObjectInfo() {
        const infoPanel = document.getElementById('spaceTourInfoPanel');
        infoPanel.classList.add('hidden');
    }

    onWindowResize() {
        const container = document.getElementById('spaceTour3DCanvas');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        
        // Update controls
        this.controls.update();

        // Animate planets in orbit
        this.planets.forEach(planet => {
            const userData = planet.userData;
            if (userData.hostStar) {
                const time = this.clock.getElapsedTime();
                const angle = time * userData.orbitSpeed;
                planet.position.x = userData.hostStar.position.x + Math.cos(angle) * userData.orbitRadius;
                planet.position.z = userData.hostStar.position.z + Math.sin(angle) * userData.orbitRadius;
            }
        });

        // Animate nebula
        if (this.nebula) {
            this.nebula.rotation.z += 0.0005;
        }

        // Animate space dust
        if (this.spaceDust) {
            this.spaceDust.rotation.y += 0.0002;
        }

        // Twinkling stars
        this.stars.forEach((star, index) => {
            const twinkle = Math.sin(this.clock.getElapsedTime() * 2 + index) * 0.1 + 0.9;
            star.material.opacity = twinkle;
        });

        this.renderer.render(this.scene, this.camera);
        this.updateFPS();
    }

    updateFPS() {
        const currentTime = performance.now();
        this.fpsCounter++;
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.fpsCounter * 1000) / (currentTime - this.lastTime));
            const fpsElement = document.getElementById('fpsCounter');
            if (fpsElement) {
                fpsElement.textContent = fps;
            }
            
            this.fpsCounter = 0;
            this.lastTime = currentTime;
        }
    }

    updatePerformanceStats() {
        this.objectCount = this.scene.children.length;
        const objectCounter = document.getElementById('objectCounter');
        if (objectCounter) {
            objectCounter.textContent = this.objectCount;
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            const container = document.getElementById('spaceTour3DCanvas');
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Clean up geometries and materials
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ExoAIExplorer();
});

// Add some utility functions
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add interactive effects to planet cards
    document.querySelectorAll('.planet-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});