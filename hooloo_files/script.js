document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    const STAR_COUNT = 300;
    let time = 0;
    const blackHoleRadius = 120;
    const particles = [];
    const PARTICLE_COUNT = 800;    const planets = [];
    const PLANET_COUNT = 4; // 改為4顆專案星球
    const planetRings = []; // 存儲星球的星環
    
    // 專案數據
    const projectData = {
    'AI': {
        color: { r: 100, g: 150, b: 255 },
        projects: [
            {
                title: '字跡智慧矯正系統',
                description: '即時分析學生字跡並提供智能矯正建議。',
                tech: ['Python', 'TensorFlow', 'CNN','cGAN', 'Pix2Pix'],
                details: {
                    overview: '透過CNN及Pix2Pix模型以不同書寫風格的標準中文字體為基礎進行學習，實現字跡即時評估與矯正功能。',
                    introduction: '本系統旨在利用深度學習幫助學生保持個人書寫風格同時提升字跡美觀度。',
                    timeline: { startDate: '2024/2', endDate: '2024/12', duration: '11個月', phases: [] },
                    features: ['分辨字體','即時評估','字跡矯正','保留原書寫風格'],
                    challenges: '',
                    results: '',
                    media: { images: [], videos: [{src:'https://www.youtube-nocookie.com/embed/Q9f0xyXfUW4?si=_8QVoTD3kqgkoefL'}] },
                    github: '',
                    demo: ''
                }
            },
            {
                title: 'Line機器人-飯新聞 飯Tastic',
                description: '使用ChatGPT API實現的Line互動機器人，提供每日餐飲建議。',
                tech: ['ChatGPT API', 'LINE Messaging API'],
                details: {
                    overview: '本機器人結合生成式AI技術與Line平台，解決「吃什麼」問題。',
                    introduction: '為方便用戶快速決定餐飲選擇，開發此Line互動機器人。',
                    timeline: { startDate: '2024/3', endDate: '2024/5', duration: '2個月', phases: [] },
                    features: ['每日餐飲建議','即時互動','個性化推薦'],
                    challenges: '',
                    results: '',
                    media: { images: [{src:'hooloo_files/AI_fanxinwen.jpg',alt: 'Line首頁',
      caption: 'Line首頁'}], videos: [] },
                    github: '',
                    demo: ''
                }
            }
        ]
    },
    '網頁': {
        color: { r: 255, g: 150, b: 100 },
        projects: [
            {
                title: '心血管疾病預測網站',
                description: '提供用戶註冊、登入及管理介面，並預測心血管風險。',
                tech: ['JavaScript', 'HTML', 'CSS', 'PHP', 'MySQL'],
                details: {
                    overview: '支援用戶基本認證、資料庫處理，並展示心血管疾病預測結果的Web應用。',
                    introduction: '專案中負責前後端功能與數據處理，提升用戶資料管理體驗。',
                    timeline: { startDate: '2023/5', endDate: '2023/6', duration: '1個月', phases: [] },
                    features: ['用戶註冊','登入系統','資料庫管理','心血管疾病預測'],
                    challenges: '',
                    results: '',
                    media: { images: [], videos: [{src:"https://www.youtube-nocookie.com/embed/UtwxLswCfac?si=X2DzOmtlsSbGSCam"}] },
                    github: 'https://github.com/YHOneBox/WebProgram_Final',
                    demo: 'https://adtfinalterm.000webhostapp.com/'
                }
            }
        ]
    },
    '遊戲': {
        color: { r: 150, g: 255, b: 150 },
        projects: [
            {
                title: '龍の曙光 (2D Unity 遊戲)',
                description: '結合探索、解謎、戰鬥及劇情元素的2D卷軸遊戲。',
                tech: ['Unity', 'C#'],
                details: {
                    overview: '開發一款具有豐富功能的2D RPG遊戲，玩家可在世界中探索並完成任務。',
                    introduction: '本人負責所有Unity C#開發，實現核心遊戲機制與功能測試。',
                    timeline: { startDate: '2024/2', endDate: '2025/5', duration: '15個月' , phases: [] },
                    features: ['探索世界','解謎元素','戰鬥系統','劇情推進'],
                    challenges: '',
                    results: '',
                    media: { images: [], videos: [{src:"https://www.youtube.com/embed/2PWibz-tJFM"}] },
                    github: '',
                    demo: ''
                }
            },
            {
                title: '大學畢制成果展互動裝置',
                description: '結合Unity與網頁技術的互動展覽裝置。',
                tech: ['Unity', 'JavaScript', 'HTML', 'CSS', 'Python'],
                details: {
                    overview: '為畢業展製作可與參觀者互動的裝置，提升沉浸感。',
                    introduction: '負責後端及Unity程式優化，實現投票與互動功能。',
                    timeline: { startDate: '2024/11', endDate: '2025/5', duration: '7個月', phases: [] },
                    features: ['互動裝置','投票系統','Unity整合','網頁介面'],
                    challenges: '',
                    results: '',
                    media: { images: [], videos: [{src:'https://www.youtube-nocookie.com/embed/JgfbdHXdYeQ?si=3fjDLm4sGJaMdDte'}] },
                    github: '',
                    demo: ''
                }
            }
        ]
    },
    '其他': {
        color: { r: 200, g: 200, b: 200 }, // 灰色
        projects: [
            {
                title: '通訊錄資料管理系統',
                description: 'Java桌面應用，提供資料新增、查詢、修改與刪除功能。',
                tech: ['Java'],
                details: {
                    overview: '多功能通訊錄管理，具備帳號密碼及驗證碼保護機制。',
                    introduction: '通過Java Swing與檔案處理實現用戶資料管理與安全認證。',
                    timeline: { startDate: '2022/12', endDate: '2023/1', duration: '2個月', phases: [] },
                    features: ['新增資料','查詢資料','修改資料','刪除資料','帳號密碼驗證'],
                    challenges: '',
                    results: '',
                    media: { images: [{src:'hooloo_files/other_java_management.jpg',alt: '系統畫面',
      caption: '系統畫面'}], videos: [] },
                    github: 'https://github.com/YHOneBox/OOP_Java_project',
                    demo: ''
                }
            }
        ]
    }
};
    
    // 當前選中的星球和是否顯示專案面板
    let selectedPlanet = null;
    let showProjectPanel = false;
    let hoveredPlanet = null;
    let mouseX = 0;
    let mouseY = 0;
    
    // 性能優化變量
    let frameCount = 0;
    const maxFPS = 60;
    const frameInterval = 1000 / maxFPS;
    let lastFrameTime = 0;
    
    // 預計算的數值
    const TWO_PI = Math.PI * 2;
    const HALF_PI = Math.PI * 0.5;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        
        // 設置畫布優化
        ctx.imageSmoothingEnabled = false;
          initStars();
        initParticles();
        initPlanets();
        initPlanetRings();
    }

    function initStars() {
        stars.length = 0;
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < STAR_COUNT; i++) {
            const angle = Math.random() * TWO_PI;
            const distance = Math.random() * (Math.max(width, height) * 0.4) + blackHoleRadius * 3;
              stars.push({
                angle: angle,
                distance: distance,
                orbitSpeed: Math.random() * 0.002 + 0.0005, // 軌道旋轉速度
                size: Math.random() * 1.2 + 0.3,
                brightness: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinkle: Math.random() * TWO_PI,
                zPosition: Math.sin(angle + distance * 0.001) * 0.8 // 基於角度和距離的初始z位置
            });
        }
    }

    function initPlanets() {
        planets.length = 0;
        
        const planetTypes = ['AI', '網頁', '遊戲', '其他'];
        
        for (let i = 0; i < PLANET_COUNT; i++) {
            const angle = (i / PLANET_COUNT) * TWO_PI + Math.PI / 2; // 從上方開始均勻分布
            const distance = blackHoleRadius * 3.5; // 固定距離
            const baseSize = 60; // 固定大小
            const planetType = planetTypes[i];
            
            planets.push({
                id: i,
                type: planetType,
                angle: angle,
                distance: distance,
                orbitSpeed: 0.001, // 很慢的軌道速度
                baseSize: baseSize,
                color: projectData[planetType].color,
                zPosition: Math.sin(angle) * 0.8, // 根據軌道位置動態計算前後位置
                glowIntensity: 0.8,
                atmosphereSize: baseSize * 1.5,
                pulsePhase: i * Math.PI,
                isHovered: false,
                clickable: true
            });
        }
    }

    function initPlanetRings() {
        planetRings.length = 0;
        
        for (let planetIndex = 0; planetIndex < PLANET_COUNT; planetIndex++) {
            const planet = planets[planetIndex];
            const ringStars = [];
            
            // 為每個星球創建1-2個星環
            const ringCount = Math.random() > 0.5 ? 2 : 1;
            
            for (let ringIndex = 0; ringIndex < ringCount; ringIndex++) {
                const ringRadius = planet.baseSize * (1.8 + ringIndex * 0.6); // 星環距離星球中心的距離
                const starsInRing = 12 + ringIndex * 6; // 每個星環的星星數量
                
                for (let starIndex = 0; starIndex < starsInRing; starIndex++) {
                    const angleInRing = (starIndex / starsInRing) * TWO_PI;
                    const radiusVariation = ringRadius + (Math.random() - 0.5) * 10; // 輕微的半徑變化
                      ringStars.push({
                        planetIndex: planetIndex,
                        ringIndex: ringIndex,
                        angleInRing: angleInRing,
                        radius: radiusVariation,
                        orbitSpeed: 0.008 + Math.random() * 0.005, // 增加星環旋轉速度
                        size: Math.random() * 1.5 + 0.5,
                        brightness: Math.random() * 0.6 + 0.4,
                        twinkle: Math.random() * TWO_PI,
                        twinkleSpeed: Math.random() * 0.04 + 0.01
                    });
                }
            }
            
            planetRings.push(ringStars);
        }
    }

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * TWO_PI;
            const distance = Math.random() * 350 + blackHoleRadius + 20;
            particles.push({
                angle: angle,
                distance: distance,
                originalDistance: distance,
                speed: Math.random() * 0.015 + 0.003,
                size: Math.random() * 2.5 + 0.8,
                brightness: Math.random() * 0.7 + 0.2,
                spiralOffset: Math.random() * TWO_PI,
                spiralSpeed: Math.random() * 0.008 + 0.004,
                zPosition: Math.random() * 2 - 1  // -1 到 1，負值表示在黑洞後方
            });
        }
    }

    function drawBackground() {
        // 簡化背景，減少運算
        const gradient = ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, Math.max(width, height) * 0.6
        );
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.3, '#0a0015');
        gradient.addColorStop(0.6, '#1a0030');
        gradient.addColorStop(0.8, '#0f0018');
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 大幅減少星雲雲層，只在每60幀更新一次
        if (frameCount % 60 === 0) {
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 3; i++) {
                const x = width * (0.2 + i * 0.3);
                const y = height * (0.3 + i * 0.2);
                const radius = 100 + i * 50;
                
                const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                nebulaGradient.addColorStop(0, 'rgba(120, 40, 160, 0.02)');
                nebulaGradient.addColorStop(0.7, 'rgba(80, 20, 120, 0.01)');
                nebulaGradient.addColorStop(1, 'rgba(40, 10, 60, 0.005)');
                
                ctx.fillStyle = nebulaGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, TWO_PI);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    function drawStars() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        drawStarsLayer(centerX, centerY, true); // 後方星星
    }
    
    function drawStarsFront() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        drawStarsLayer(centerX, centerY, false); // 前方星星
    }    function drawStarsLayer(centerX, centerY, isBackground) {
        ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            
            // 更新星星的軌道位置
            star.angle += star.orbitSpeed;
            star.twinkle += star.twinkleSpeed;
            
            // 計算3D軌道位置
            const x = centerX + Math.cos(star.angle) * star.distance;
            const y = centerY + Math.sin(star.angle) * star.distance * 0.3;
            
            // 根據角度判斷前後關係
            // 當 sin(angle) <= 0 時，星星在上半圓，在黑洞後方
            const starIsInBackground = Math.sin(star.angle) <= 0;
            
            // 根據 isBackground 參數決定繪製哪些星星
            if (isBackground && !starIsInBackground) continue;
            if (!isBackground && starIsInBackground) continue;
            
            // 計算黑洞遮擋效果 - 只對後方星星進行遮擋檢查
            let occlusionFactor = 1.0;
            
            if (isBackground && starIsInBackground) {
                const distanceFromBlackHoleCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                if (distanceFromBlackHoleCenter < blackHoleRadius * 1.6) {
                    const maxOcclusionDistance = blackHoleRadius * 1.6;
                    const minOcclusionDistance = blackHoleRadius * 0.7;
                    
                    if (distanceFromBlackHoleCenter < minOcclusionDistance) {
                        occlusionFactor = 0.0; // 完全遮擋
                    } else {
                        // 漸進式遮擋
                        const distanceRatio = (distanceFromBlackHoleCenter - minOcclusionDistance) / 
                                            (maxOcclusionDistance - minOcclusionDistance);
                        occlusionFactor = distanceRatio;
                    }
                }
            }
              
            // 計算亮度
            const twinkleBrightness = (Math.sin(star.twinkle) + 1) * 0.25 + 0.5;
            let brightness = star.brightness * twinkleBrightness;
            
            // 後方星星減暗
            if (isBackground) {
                brightness *= 0.4;
            }
            
            // 根據前後位置調整亮度
            const depthBrightness = starIsInBackground ? 0.6 : 1.0;
            brightness *= depthBrightness;
            
            // 應用遮擋效果到亮度
            brightness *= occlusionFactor;
            
            if (brightness < 0.02) {
                continue;
            }
            
            ctx.fillStyle = `rgba(255,255,255,${brightness})`;
            
            // 根據前後位置調整星星大小
            let starSize = star.size;
            if (isBackground) {
                starSize *= 0.7;
            }
            if (starIsInBackground) {
                starSize *= 0.8; // 後方星星略小
            }
            
            ctx.beginPath();
            ctx.arc(x, y, starSize, 0, TWO_PI);
            ctx.fill();
        }
        
        ctx.globalCompositeOperation = 'source-over';
    }function drawPlanets() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 繪製後方星球和星環 (在上半圓的星球 = 在黑洞後方)
        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            
            // 計算移動方向：上半圓的星球在後方
            // 當 sin(angle) <= 0 時，星球在上半圓，在黑洞後方
            const isInBackground = Math.sin(planet.angle) <= 0;
            
            if (isInBackground) {
                planet.isInBackground = true;
                drawPlanet(planet, centerX, centerY);
                drawPlanetRings(i, centerX, centerY, true); // 繪製後方星環
            }
        }
    }
    
    function drawPlanetsFront() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 重置懸停狀態
        hoveredPlanet = null;
        
        // 繪製前方星球和星環 (在下半圓的星球 = 在黑洞前方)
        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            
            // 計算移動方向：下半圓的星球在前方
            const isInBackground = Math.sin(planet.angle) <= 0;
            
            if (!isInBackground) {
                planet.isInBackground = false;
                drawPlanet(planet, centerX, centerY);
                drawPlanetRings(i, centerX, centerY, false); // 繪製前方星環
            }
        }
    }      function drawPlanet(planet, centerX, centerY) {
        // 更新行星位置
        planet.angle += planet.orbitSpeed;
        planet.pulsePhase += 0.02;
        
        // 計算3D位置
        const x = centerX + Math.cos(planet.angle) * planet.distance;
        const y = centerY + Math.sin(planet.angle) * planet.distance * 0.3; // 橢圓軌道
        
        // 根據角度判斷是否在黑洞後方
        // 當 sin(angle) <= 0 時，星球在上半圓，在黑洞後方
        const isInBackground = Math.sin(planet.angle) <= 0;
        planet.isInBackground = isInBackground;
        
        // 計算深度效果 - 後方星球較小，前方星球較大
        const depthEffect = isInBackground ? 0.85 : 1.15;
        
        // 計算脈衝效果
        const pulseVariation = Math.sin(planet.pulsePhase) * 0.1 + 1;
        const planetSize = planet.baseSize * depthEffect * pulseVariation;
          
        // 檢查滑鼠懸停
        const distanceFromMouse = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        planet.isHovered = distanceFromMouse < planetSize;
        if (planet.isHovered) {
            hoveredPlanet = planet;
        }
        
        // 懸停效果
        const hoverScale = planet.isHovered ? 1.2 : 1;
        const finalSize = planetSize * hoverScale;
        
        // 計算黑洞遮擋效果（只影響後方星球的光暈）
        const distanceFromBlackHoleCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        let glowOcclusionFactor = 1.0;
        
        // 只有後方星球（上半圓）且靠近黑洞時才進行遮擋
        if (isInBackground && distanceFromBlackHoleCenter < blackHoleRadius * 1.6) {
            const maxOcclusionDistance = blackHoleRadius * 1.6;
            const minOcclusionDistance = blackHoleRadius * 0.9;
            
            if (distanceFromBlackHoleCenter < minOcclusionDistance) {
                glowOcclusionFactor = 0.1; // 光暈幾乎完全遮擋
            } else {
                // 漸進式遮擋光暈
                const distanceRatio = (distanceFromBlackHoleCenter - minOcclusionDistance) / 
                                    (maxOcclusionDistance - minOcclusionDistance);
                glowOcclusionFactor = 0.1 + (distanceRatio * 0.9);
            }
        }
        
        // 繪製大氣層光暈
        const atmosphereSize = planet.atmosphereSize * depthEffect * hoverScale * 1.5;
        ctx.globalCompositeOperation = 'lighter';
        
        const atmosphereGradient = ctx.createRadialGradient(x, y, 0, x, y, atmosphereSize);
        const baseGlowAlpha = planet.glowIntensity * (planet.isHovered ? 0.6 : 0.3);
        const adjustedGlowAlpha = isInBackground ? baseGlowAlpha * 0.4 * glowOcclusionFactor : baseGlowAlpha;
        
        atmosphereGradient.addColorStop(0, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, ${adjustedGlowAlpha})`);
        atmosphereGradient.addColorStop(0.4, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, ${adjustedGlowAlpha * 0.4})`);
        atmosphereGradient.addColorStop(1, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, 0)`);
        
        ctx.fillStyle = atmosphereGradient;
        ctx.beginPath();
        ctx.arc(x, y, atmosphereSize, 0, TWO_PI);
        ctx.fill();
          
        // 繪製星球本體 - 永遠清晰可見，但後方星球略暗
        ctx.globalCompositeOperation = 'source-over';
        const coreGradient = ctx.createRadialGradient(
            x - finalSize * 0.3, y - finalSize * 0.3, 0,
            x, y, finalSize
        );
        
        const brightnessFactor = planet.isHovered ? 1.3 : 1;
        const depthBrightnessFactor = isInBackground ? 0.75 : 1; // 後方星球稍微變暗但仍清晰
        
        const r = Math.min(255, planet.color.r * 1.5 * brightnessFactor * depthBrightnessFactor);
        const g = Math.min(255, planet.color.g * 1.5 * brightnessFactor * depthBrightnessFactor);
        const b = Math.min(255, planet.color.b * 1.5 * brightnessFactor * depthBrightnessFactor);
        
        coreGradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
        coreGradient.addColorStop(0.6, `rgb(${Math.floor(planet.color.r * brightnessFactor * depthBrightnessFactor)}, ${Math.floor(planet.color.g * brightnessFactor * depthBrightnessFactor)}, ${Math.floor(planet.color.b * brightnessFactor * depthBrightnessFactor)})`);
        coreGradient.addColorStop(1, `rgb(${Math.floor(planet.color.r * 0.6 * brightnessFactor * depthBrightnessFactor)}, ${Math.floor(planet.color.g * 0.6 * brightnessFactor * depthBrightnessFactor)}, ${Math.floor(planet.color.b * 0.6 * brightnessFactor * depthBrightnessFactor)})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, finalSize, 0, TWO_PI);
        ctx.fill();
        
        // 繪製星球上的文字標籤
        drawPlanetLabel(planet, x, y, finalSize, 1.0);
          
        // 儲存位置信息供點擊檢測使用
        planet.screenX = x;
        planet.screenY = y;
        planet.screenRadius = finalSize;
        planet.isClickable = true;
    }
      function drawPlanetLabel(planet, x, y, size, alphaMultiplier = 1) {
        ctx.save();
        
        // 設置高質量文字渲染
        ctx.textRenderingOptimization = 'optimizeQuality';
        ctx.imageSmoothingEnabled = true;
        
        // 設置文字樣式 - 增大字體大小以提高清晰度
        const fontSize = Math.max(16, size * 0.25);
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 文字位置（在星球中心）
        const labelY = y;
          // 增強文字陰影效果（提供更好的對比度）
        const shadowBlur = 4;
        const shadowAlpha = 0.95; // 文字陰影始終保持高對比度
        
        // 多重陰影效果
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.fillText(planet.type, x, labelY);
        
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = -2;
        ctx.fillText(planet.type, x, labelY);
        
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = -2;
        ctx.fillText(planet.type, x, labelY);
        
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(planet.type, x, labelY);
        
        // 重置陰影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 主要文字（完全不透明的高對比度白色）
        ctx.fillStyle = `rgba(255, 255, 255, 1.0)`;
        ctx.fillText(planet.type, x, labelY);
        
        // 懸停時顯示額外信息
        if (planet.isHovered) {
            const subText = `點擊查看專案`;
            const subFontSize = Math.max(12, fontSize * 0.65);
            ctx.font = `${subFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
            const subTextY = labelY + fontSize * 0.9;
              // 子文字陰影
            ctx.shadowColor = `rgba(0, 0, 0, 0.9)`;
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillStyle = `rgba(0, 0, 0, 0.9)`;
            ctx.fillText(subText, x, subTextY);
            
            // 重置陰影
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // 子文字（完全不透明）
            ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
            ctx.fillText(subText, x, subTextY);
        }
          ctx.restore();
    }    function drawPlanetRings(planetIndex, centerX, centerY, isBackground) {
        if (planetIndex >= planetRings.length) return;
        
        const planet = planets[planetIndex];
        const ringStars = planetRings[planetIndex];
        
        // 計算星球的當前位置
        const planetX = centerX + Math.cos(planet.angle) * planet.distance;
        const planetY = centerY + Math.sin(planet.angle) * planet.distance * 0.3;
        
        ctx.globalCompositeOperation = 'lighter';
        
        for (let star of ringStars) {
            // 更新星環星星的角度
            star.angleInRing += star.orbitSpeed;
            star.twinkle += star.twinkleSpeed;
              
            // 計算星環星星相對於星球的位置
            const ringStarX = planetX + Math.cos(star.angleInRing + planet.angle * 0.1) * star.radius;
            const ringStarY = planetY + Math.sin(star.angleInRing + planet.angle * 0.1) * star.radius * 0.3; // 扁平的星環
            
            // 計算星環星星的角度位置
            // 星環星星的角度基於它在環中的角度和星球的軌道運動
            const combinedAngle = star.angleInRing + planet.angle * 0.1 + planet.angle;
            const starIsInBackground = Math.sin(combinedAngle) <= 0;
            
            // 根據 isBackground 參數決定繪製哪些星環星星
            if (isBackground && !starIsInBackground) continue;
            if (!isBackground && starIsInBackground) continue;
            
            // 計算星環星星到黑洞中心的距離
            const starDistanceFromCenter = Math.sqrt((ringStarX - centerX) ** 2 + (ringStarY - centerY) ** 2);
            
            // 計算黑洞遮擋效果 - 只對後方星環星星進行遮擋檢查
            let occlusionFactor = 1.0;
            
            if (isBackground && starIsInBackground) {
                if (starDistanceFromCenter < blackHoleRadius * 1.6) {
                    const maxOcclusionDistance = blackHoleRadius * 1.6;
                    const minOcclusionDistance = blackHoleRadius * 0.7;
                    
                    if (starDistanceFromCenter < minOcclusionDistance) {
                        occlusionFactor = 0.0; // 完全遮擋
                    } else {
                        const distanceRatio = (starDistanceFromCenter - minOcclusionDistance) / 
                                            (maxOcclusionDistance - minOcclusionDistance);
                        occlusionFactor = distanceRatio;
                    }
                }
            }
            
            // 計算亮度
            const twinkleBrightness = (Math.sin(star.twinkle) + 1) * 0.25 + 0.5;
            let brightness = star.brightness * twinkleBrightness;
            
            // 後方星環星星較暗
            if (isBackground) {
                brightness *= 0.4;
            }
            
            // 根據前後位置調整亮度
            const depthBrightness = starIsInBackground ? 0.6 : 1.0;
            brightness *= depthBrightness;
              
            // 應用遮擋效果
            brightness *= occlusionFactor;
            
            if (brightness < 0.02) {
                continue;
            }
            
            // 使用星球的顏色為星環著色
            const planetColor = planet.color;
            const r = Math.floor(planetColor.r * 0.8 + 255 * 0.2); // 混合白色
            const g = Math.floor(planetColor.g * 0.8 + 255 * 0.2);
            const b = Math.floor(planetColor.b * 0.8 + 255 * 0.2);
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
            
            // 根據前後位置調整星星大小
            let starSize = star.size;
            if (isBackground) {
                starSize *= 0.7;
            }
            if (starIsInBackground) {
                starSize *= 0.8; // 後方星環星星略小
            }
            
            ctx.beginPath();
            ctx.arc(ringStarX, ringStarY, starSize, 0, TWO_PI);
            ctx.fill();
        }
        
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawAccretionDisk() {
        const centerX = width / 2;
        const centerY = height / 2;
        time += 0.008;
        
        ctx.globalCompositeOperation = 'lighter';
        
        // 第一次：繪製黑洞後方的粒子（zPosition < 0）
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            if (particle.zPosition >= 0) continue; // 跳過前方粒子
            
            updateAndDrawParticle(particle, centerX, centerY, true); // 後方粒子較暗
        }
    }
    
    function drawAccretionDiskFront() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.globalCompositeOperation = 'lighter';
        
        // 第二次：繪製黑洞前方的粒子（zPosition >= 0）
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            if (particle.zPosition < 0) continue; // 跳過後方粒子
            
            updateAndDrawParticle(particle, centerX, centerY, false); // 前方粒子較亮
        }
    }

    function updateAndDrawParticle(particle, centerX, centerY, isBackground) {
        // 更新粒子位置
        const rotationSpeed = particle.speed * (1.5 - (particle.distance - blackHoleRadius) / 400);
        particle.angle += rotationSpeed;
        particle.spiralOffset += particle.spiralSpeed;
        
        // 緩慢內旋，模擬物質被吸入
        particle.distance -= 0.15;
        
        if (particle.distance < blackHoleRadius) {
            particle.distance = particle.originalDistance;
            particle.angle = Math.random() * TWO_PI;
            particle.zPosition = Math.random() * 2 - 1;
        }
        
        // 計算位置
        const spiralFactor = Math.sin(particle.spiralOffset) * 0.3;
        const totalAngle = particle.angle + spiralFactor + time * 0.5;
        const cosAngle = Math.cos(totalAngle);
        const sinAngle = Math.sin(totalAngle);
          const zOffset = particle.zPosition * 0.1;
        const x = centerX + cosAngle * particle.distance;
        const y = centerY + sinAngle * particle.distance * (0.25 + zOffset);
          // 計算黑洞遮擋效果 - 所有在後方的粒子都要檢查遮擋
        const distanceFromBlackHoleCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        let occlusionFactor = 1.0; // 1.0 = 完全可見, 0.0 = 完全遮擋
        
        // 對所有在後方的粒子進行遮擋檢查（不只是isBackground階段）
        if (particle.zPosition < 0 && distanceFromBlackHoleCenter < blackHoleRadius * 1.5) {
            // 計算遮擋程度 - 距離黑洞越近，遮擋越多
            const maxOcclusionDistance = blackHoleRadius * 1.5;
            const minOcclusionDistance = blackHoleRadius * 0.8;
            
            if (distanceFromBlackHoleCenter < minOcclusionDistance) {
                occlusionFactor = 0.01; // 幾乎完全遮擋
            } else {
                // 漸進式遮擋
                const distanceRatio = (distanceFromBlackHoleCenter - minOcclusionDistance) / 
                                    (maxOcclusionDistance - minOcclusionDistance);
                occlusionFactor = 0.01 + (distanceRatio * 0.99); // 從0.01到1.0的漸變
            }
        }
          // 計算亮度
        const distanceRatio = (particle.distance - blackHoleRadius) / 300;
        let brightness = particle.brightness * (1 - distanceRatio * 0.6);
        
        if (isBackground) {
            brightness *= 0.4;
        }
        
        const rotationBrightness = (Math.sin(particle.angle * 3 + time * 2) + 1) * 0.2 + 0.8;
        let finalBrightness = brightness * rotationBrightness;
        
        // 應用遮擋效果到亮度
        finalBrightness *= occlusionFactor;
        
        if (finalBrightness > 0.02) {
            let r, g, b;
            if (distanceRatio < 0.4) {
                r = 255; g = 180; b = 220;
            } else if (distanceRatio < 0.7) {
                r = 220; g = 120; b = 180;
            } else {
                r = 160; g = 80; b = 200;
            }
            
            if (isBackground) {
                r *= 0.7; g *= 0.8; b *= 1.1;
            }
            
            const alpha = finalBrightness * 0.6;
            ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${alpha})`;
            
            let rotationSize = particle.size * (0.8 + rotationBrightness * 0.4);
            if (isBackground) {
                rotationSize *= 0.8;
            }
            
            ctx.beginPath();
            ctx.arc(x, y, rotationSize, 0, TWO_PI);
            ctx.fill();
        }
    }

    function drawPolarJets() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.globalCompositeOperation = 'lighter';
        
        for (let jet = 0; jet < 2; jet++) {
            const direction = jet === 0 ? -1 : 1;
            
            for (let i = 0; i < 150; i++) {
                const distance = blackHoleRadius + i * 3.5;
                const spread = Math.pow(i / 80, 1.1) * 20;
                const turbulence = Math.sin(time * 1.5 + i * 0.08) * spread * 0.25;
                
                const opacity = Math.max(0, 1 - i / 120);
                
                if (opacity > 0.08) {
                    const x = centerX + (Math.random() - 0.5) * spread + turbulence;
                    const y = centerY + direction * distance;
                    
                    if (y >= -30 && y <= height + 30) {
                        const edgeDistance = Math.abs((Math.random() - 0.5) * spread);
                        let r, g, b;
                        
                        if (edgeDistance < spread * 0.4) {
                            r = 255; g = 160; b = 220;
                        } else {
                            r = 140; g = 80; b = 200;
                        }
                        
                        const brightness = opacity * 0.6;
                        ctx.fillStyle = `rgba(${r},${g},${b},${brightness})`;
                        
                        const size = opacity * 2.5;
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, TWO_PI);
                        ctx.fill();
                    }
                }
            }
        }
    }

    function drawBlackHole() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 光子球效果
        const photonGradient = ctx.createRadialGradient(
            centerX, centerY, blackHoleRadius * 0.9,
            centerX, centerY, blackHoleRadius * 1.6
        );
        photonGradient.addColorStop(0, 'rgba(200, 150, 220, 0.08)');
        photonGradient.addColorStop(0.5, 'rgba(150, 100, 180, 0.03)');
        photonGradient.addColorStop(1, 'rgba(80, 40, 120, 0.01)');
        
        ctx.fillStyle = photonGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, blackHoleRadius * 1.6, 0, TWO_PI);
        ctx.fill();
        
        // 事件視界
        const eventHorizonGradient = ctx.createRadialGradient(
            centerX, centerY, blackHoleRadius * 0.7,
            centerX, centerY, blackHoleRadius
        );
        eventHorizonGradient.addColorStop(0, '#000000');
        eventHorizonGradient.addColorStop(0.8, '#000000');
        eventHorizonGradient.addColorStop(0.95, 'rgba(80, 15, 50, 0.2)');
        eventHorizonGradient.addColorStop(1, 'rgba(150, 40, 100, 0.08)');
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = eventHorizonGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, blackHoleRadius, 0, TWO_PI);
        ctx.fill();
        
        // 最中心的完全不透明黑球
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, blackHoleRadius * 0.7, 0, TWO_PI);
        ctx.fill();
    }

    // 滑鼠事件處理
    function handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        
        // 更新畫布游標
        if (hoveredPlanet) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    }
      function handleMouseClick(event) {
        // 檢查所有星球，不管它們是否被遮擋
        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];
            if (planet.screenX && planet.screenY && planet.screenRadius) {
                const distanceFromPlanet = Math.sqrt(
                    (mouseX - planet.screenX) ** 2 + (mouseY - planet.screenY) ** 2
                );
                if (distanceFromPlanet < planet.screenRadius && planet.isClickable) {
                    selectedPlanet = planet;
                    showProjectPanel = true;
                    createProjectPanel();
                    return; // 只處理第一個被點擊的星球
                }
            }
        }
    }
    
    function createProjectPanel() {
        // 移除現有面板
        const existingPanel = document.querySelector('.project-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        if (!selectedPlanet) return;
        
        const panel = document.createElement('div');
        panel.className = 'project-panel';
        panel.innerHTML = `
            <div class="project-panel-content">
                <div class="project-panel-header">
                    <h2>${selectedPlanet.type} 專案</h2>
                    <button class="close-btn" onclick="closeProjectPanel()">×</button>
                </div>
                <div class="project-list">
                    ${projectData[selectedPlanet.type].projects.map((project, index) => `
                        <div class="project-item" data-project-index="${index}" onclick="showProjectDetail('${selectedPlanet.type}', ${index})">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="tech-tags">
                                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 添加關閉面板的函數到全局作用域
        window.closeProjectPanel = function() {
            const panel = document.querySelector('.project-panel');
            const detailPanel = document.querySelector('.project-detail-panel');
            if (panel) panel.remove();
            if (detailPanel) detailPanel.remove();
            showProjectPanel = false;
            selectedPlanet = null;
        };
        
        // 添加顯示專案詳情的函數到全局作用域
        window.showProjectDetail = function(category, projectIndex) {
            createProjectDetailPanel(category, projectIndex);
        };
        
        // 點擊背景關閉面板
        panel.addEventListener('click', function(e) {
            if (e.target === panel) {
                window.closeProjectPanel();
            }
        });
        
        // ESC 鍵關閉面板
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && showProjectPanel) {
                window.closeProjectPanel();
            }
        });
    }    function createProjectDetailPanel(category, projectIndex) {
        const project = projectData[category].projects[projectIndex];
        
        // 移除現有詳情面板
        const existingDetailPanel = document.querySelector('.project-detail-panel');
        if (existingDetailPanel) {
            existingDetailPanel.remove();
        }
        
        // 建構媒體展示部分（頂部）
        // Build media section only if there are videos or images
        const hasMedia = project.details.media && ((project.details.media.videos && project.details.media.videos.length > 0) || (project.details.media.images && project.details.media.images.length > 0));
        let mediaSection = hasMedia ? `
            <div class="project-media-hero">
                ${project.details.media.videos && project.details.media.videos.length > 0 ? 
                    `<div class="hero-video">
                        <div class="video-wrapper">
                            <iframe src="${project.details.media.videos[0].src}" 
                                    title="${project.details.media.videos[0].title}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                    </div>` : project.details.media.images && project.details.media.images.length > 0 ?
                    `<div class="hero-image">
                        <img src="${project.details.media.images[0].src}" alt="${project.details.media.images[0].alt}">
                        <div class="hero-image-caption">${project.details.media.images[0].caption}</div>
                    </div>` : ''}
                ${project.details.media.images && project.details.media.images.length > 1 ?
                    `<div class="additional-images">
                        ${project.details.media.images.slice(1).map(image =>
                            `<div class="image-thumbnail" onclick="openImageModal('${image.src}', '${image.alt}', '${image.caption}')">
                                <img src="${image.src}" alt="${image.alt}" loading="lazy">
                            </div>`
                        ).join('')}
                    </div>` : ''}
            </div>` : '';
        // 如果沒有媒體內容，顯示佔位區域
        if (!hasMedia) {
            mediaSection = `<div class="project-media-hero"><div class="hero-placeholder">請添加影片或圖片</div></div>`;
        }
        
        // 建構左右分欄內容
        // 建構左右分欄內容，只渲染有資料的區塊
        // 左欄
        const introSec = (project.details.overview || project.details.introduction) ?
            `<div class="project-introduction">
                <h3>專案介紹</h3>
                ${project.details.overview ? `<p>${project.details.overview}</p>` : ''}
                ${project.details.introduction ? `<p>${project.details.introduction}</p>` : ''}
            </div>` : '';
        const featSec = (project.details.features && project.details.features.length) ?
            `<div class="project-features">
                <h3>主要功能</h3>
                <ul>${project.details.features.map(f => `<li>${f}</li>`).join('')}</ul>
            </div>` : '';
        const challSec = project.details.challenges ?
            `<div class="project-challenges">
                <h3>開發挑戰</h3>
                <p>${project.details.challenges}</p>
            </div>` : '';
        const resultSec = project.details.results ?
            `<div class="project-results">
                <h3>專案成果</h3>
                <p>${project.details.results}</p>
            </div>` : '';
        const leftColumnContent = `
            <div class="left-column">
                ${introSec}${featSec}${challSec}${resultSec}
            </div>`;
        
        // 右欄
        let rightColumnContent = '';
        if (project.details.timeline) {
            const summaryItems = [];
            if (project.details.timeline.startDate) summaryItems.push(`<div class="timeline-item"><span class="timeline-label">開始時間</span><span class="timeline-value">${project.details.timeline.startDate}</span></div>`);
            if (project.details.timeline.endDate) summaryItems.push(`<div class="timeline-item"><span class="timeline-label">結束時間</span><span class="timeline-value">${project.details.timeline.endDate}</span></div>`);
            if (project.details.timeline.duration) summaryItems.push(`<div class="timeline-item"><span class="timeline-label">總時長</span><span class="timeline-value">${project.details.timeline.duration}</span></div>`);
            const summarySection = summaryItems.length ? `<div class="timeline-summary">${summaryItems.join('')}</div>` : '';
            let phasesSection = '';
            if (project.details.timeline.phases && project.details.timeline.phases.length) {
                const ps = project.details.timeline.phases.map((p, i) => `<div class="phase-item"><div class="phase-number">${i+1}</div><div class="phase-content"><h5>${p.phase}</h5><span class="phase-period">${p.period}</span><p>${p.description}</p></div></div>`).join('');
                phasesSection = `<div class="timeline-phases-compact"><h4>開發階段</h4>${ps}</div>`;
            }
            if (summarySection || phasesSection) {
                rightColumnContent = `<div class="right-column"><div class="project-timeline-compact">${summarySection}${phasesSection}</div></div>`;
            }
        }
        
        // Build tech section only if tech tags exist
        const techSection = project.tech && project.tech.length > 0 ?
            `<div class="project-tech">
                <h3>使用技術</h3>
                <div class="tech-tags">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>` : '';
        
        // Build links section only if URLs provided
        let linkButtons = '';
        if (project.details.github) {
            linkButtons += `<a href="${project.details.github}" target="_blank" class="link-btn github-btn">
                                <span>📁</span> GitHub 程式碼
                            </a>`;
        }
        if (project.details.demo) {
            linkButtons += `<a href="${project.details.demo}" target="_blank" class="link-btn demo-btn">
                                <span>🚀</span> 線上展示
                            </a>`;
        }
        const linksSection = linkButtons ?
            `<div class="project-links">
                <h3>相關連結</h3>
                <div class="link-buttons">
                    ${linkButtons}
                </div>
            </div>` : '';
        
        // Insert these into the template
        const detailPanel = document.createElement('div');
        detailPanel.className = 'project-detail-panel';
        detailPanel.innerHTML = `
            <div class="project-detail-content">
                <div class="project-detail-header">
                    <button class="back-btn" onclick="closeProjectDetail()">← 返回</button>
                    <h2>${project.title}</h2>
                    <button class="close-btn" onclick="closeProjectPanel()">×</button>
                </div>
                
                ${mediaSection}
                
                <div class="project-detail-body">
                    <div class="two-column-layout">
                        ${leftColumnContent}
                        ${rightColumnContent}
                    </div>
                    ${techSection}
                    ${linksSection}
                </div>
            </div>
        `;
        
        document.body.appendChild(detailPanel);
        
        // 添加關閉詳情面板的函數
        window.closeProjectDetail = function() {
            const detailPanel = document.querySelector('.project-detail-panel');
            if (detailPanel) {
                detailPanel.remove();
            }
        };
        
        // 添加圖片模態框功能
        window.openImageModal = function(src, alt, caption) {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
                    <img src="${src}" alt="${alt}">
                    <div class="image-modal-caption">${caption}</div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // 點擊背景關閉
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeImageModal();
                }
            });
        };
        
        window.closeImageModal = function() {
            const modal = document.querySelector('.image-modal');
            if (modal) {
                modal.remove();
            }
        };
        
        // 點擊背景關閉詳情面板
        detailPanel.addEventListener('click', function(e) {
            if (e.target === detailPanel) {
                window.closeProjectDetail();
            }
        });
    }

    function animate(currentTime) {
        // 控制幀率
        if (currentTime - lastFrameTime < frameInterval) {
            requestAnimationFrame(animate);
            return;
        }
        lastFrameTime = currentTime;
        frameCount++;
        
        // 清除畫布
        ctx.clearRect(0, 0, width, height);
        
        // 繪製各個組件 - 調整繪製順序以創造正確的前後層次
        drawBackground();
        drawStars(); // 先繪製後方星星
        drawPlanets(); // 繪製後方行星
        drawAccretionDisk(); // 繪製黑洞後方的吸積盤
        drawBlackHole(); // 繪製黑洞本體
        drawAccretionDiskFront(); // 繪製黑洞前方的吸積盤
        drawPlanetsFront(); // 繪製前方行星
        drawStarsFront(); // 繪製前方星星
        drawPolarJets(); // 最後繪製噴流（在最前方）
        
        requestAnimationFrame(animate);
    }

    // 初始化和啟動
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);
    resize();
    requestAnimationFrame(animate);
});
