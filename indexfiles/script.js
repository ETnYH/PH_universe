// Skip按钮跳转函数
function skipToHome() {
    window.location.href = 'home.html';
}

// Overwrite entire file with improved animation script
(function(){
    const canvas = document.getElementById('meteorCanvas');
    const ctx = canvas.getContext('2d');
    let phase = 'meteors';
    let frame = 0;
    
    // Phase timers
    let explosionFrames = 0;
    let travelFrames = 0;
    let galaxyFrames = 0;
    
    // Meteors
    const METEOR_SPEED = 1.2;
    const meteors = [];
    
    // Sparkles system for meteors
    let sparkles = [];
    
    // Sparkle class
    class Sparkle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            // 火花朝移动方向的相反方向喷射
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed > 0) {
                const dirX = vx / speed;
                const dirY = vy / speed;
                
                // 主要朝反方向，加上一些随机扩散
                const backSpeed = speed * (0.3 + Math.random() * 0.4); // 30%-70%的反向速度
                const randomAngle = (Math.random() - 0.5) * Math.PI * 0.5; // ±45度的随机角度
                
                this.vx = -dirX * backSpeed * Math.cos(randomAngle) - dirY * backSpeed * Math.sin(randomAngle);
                this.vy = -dirY * backSpeed * Math.cos(randomAngle) + dirX * backSpeed * Math.sin(randomAngle);
            } else {
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
            }
            
            this.life = 1.0; // 生命值从1到0
            this.decay = 0.008 + Math.random() * 0.012; // 进一步减慢衰减速度，让火花持续更久
            this.size = 6 + Math.random() * 12; // 大幅增加火花大小 (从6-14增加到12-28)
            this.color = Math.random() < 0.3 ? 'white' : (Math.random() < 0.6 ? 'orange' : 'yellow'); // 添加白色火花
            this.twinkle = Math.random() * Math.PI * 2; // 闪烁相位
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.twinkle += 0.3;
            
            // 移除重力效果，只添加轻微的空气阻力
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            return this.life > 0;
        }
        
        draw(ctx) {
            if (this.life <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.life * (0.7 + 0.3 * Math.sin(this.twinkle)); // 增加基础透明度
            
            // 绘制更大更长的星形火花
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            
            // 绘制更粗更长的十字星形
            const size = this.size * this.life;
            const thickness = Math.max(3, size * 0.25); // 增加厚度
            const length = size * 1.5; // 增加长度倍数
            ctx.fillRect(-length/2, -thickness/2, length, thickness);
            ctx.fillRect(-thickness/2, -length/2, thickness, length);
            
            // 绘制更粗更长的对角线
            ctx.rotate(Math.PI / 4);
            const diagonalLength = length * 0.9; // 对角线也增加长度
            const diagonalThickness = Math.max(2, size * 0.2);
            ctx.fillRect(-diagonalLength/2, -diagonalThickness/2, diagonalLength, diagonalThickness);
            ctx.fillRect(-diagonalThickness/2, -diagonalLength/2, diagonalThickness, diagonalLength);
            
            // 添加更大的光晕效果
            ctx.globalAlpha = this.life * 0.3;
            ctx.fillStyle = 'white';
            const glowLength = length * 1.3; // 光晕也增加长度
            const glowThickness = Math.max(2, thickness * 0.8);
            ctx.rotate(-Math.PI / 4); // 恢复旋转
            ctx.fillRect(-glowLength/2, -glowThickness/2, glowLength, glowThickness);
            ctx.fillRect(-glowThickness/2, -glowLength/2, glowThickness, glowLength);
            
            ctx.restore();
        }
    }
    
    // 创建火花的函数
    function createSparkles(x, y, vx, vy, count = 6) { // 增加默认数量从3到6
        // 计算陨石移动方向的反方向
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed === 0) return; // 如果陨石不移动，不生成火花
        
        // 标准化移动方向
        const dirX = vx / speed;
        const dirY = vy / speed;
        
        for (let i = 0; i < count; i++) {
            // 在陨石后方（移动方向的反方向）生成火花
            const backDistance = 20 + Math.random() * 30; // 距离陨石20-35像素
            const backX = x - dirX * backDistance;
            const backY = y - dirY * backDistance;
            
            // 添加一些随机扩散，但主要在垂直于移动方向的轴上
            const perpX = -dirY; // 垂直方向
            const perpY = dirX;
            const scatter = (Math.random() - 0.5) * 40;
            
            sparkles.push(new Sparkle(
                backX + perpX * scatter,
                backY + perpY * scatter,
                vx, // 直接传入陨石速度
                vy
            ));
        }
    }
    
    // 更新和绘制所有火花
    function updateAndDrawSparkles() {
        sparkles = sparkles.filter(sparkle => {
            const alive = sparkle.update();
            if (alive) {
                sparkle.draw(ctx);
            }
            return alive;
        });
    }
    
    // Travel
    let stars = [];
    const STAR_COUNT = 4000;
    
    // Galaxy
    let galaxyStars = [];
    const GALAXY_SCALE_DURATION = 250;
    
    // Mysterious Text Animation
    const MYSTERIOUS_TEXT = [
        "您好，歡迎來到我們的世界",
        "就讓我們一起",
        "探索未知吧"
    ];
    let textAnimationActive = false;
    let currentTextLine = 0;
    let textAppearFrames = 0;
    const TEXT_FADE_IN_DURATION = 5;   // 淡入时间
    const TEXT_DISPLAY_DURATION = 35;   // 完全显示时间
    const TEXT_FADE_OUT_DURATION = 5;  // 淡出时间
    const TEXT_TOTAL_DURATION = TEXT_FADE_IN_DURATION + TEXT_DISPLAY_DURATION + TEXT_FADE_OUT_DURATION; // 总持续时间
    const GALAXY_TEXT_TRIGGER = 0.4;  // 银河系放大到40%时触发文字
    
    // Hyperspace Jump Animation
    let hyperspaceActive = false;
    let hyperspaceFrames = 0;
    const HYPERSPACE_DURATION = 100; // 星际穿梭持续时间
    const HYPERSPACE_DELAY = 3;     // 文字结束后的延迟时间
    
    // Meteor Images
    let meteorImages = [];
    let imagesLoaded = 0;
    const totalImages = 2;
    let useCustomImages = false;
    
    // Load meteor images
    function loadMeteorImages() {
        const imageNames = ['meteor1.png', 'meteor2.png'];
        
        imageNames.forEach((imageName, index) => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                meteorImages[index] = img;
                if (imagesLoaded === totalImages) {
                    useCustomImages = true;
                    console.log('All meteor images loaded successfully');
                    init();
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load ${imageName}, using default meteor rendering`);
                imagesLoaded++;
                meteorImages[index] = null;
                if (imagesLoaded === totalImages) {
                    useCustomImages = false;
                    init();
                }
            };
            img.src = `indexfiles/${imageName}`;
        });
    }

    window.resizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', window.resizeHandler);
    function init(){
        window.resizeHandler();
        // Meteors
        meteors.length = 0;
        meteors.push({
            x: canvas.width * 0.15,
            y: canvas.height / 2,
            dx: METEOR_SPEED,
            dy: 0,
            imageIndex: 0,
            rotation: 0,
            rotationSpeed: 0.02 // 慢慢旋转
        });
        meteors.push({
            x: canvas.width * 0.85,
            y: canvas.height / 2,
            dx: -METEOR_SPEED,
            dy: 0,
            imageIndex: 1,
            rotation: 0,
            rotationSpeed: -0.015 // 反方向慢慢旋转
        });
        // Stars
        stars = [];
        for(let i=0;i<STAR_COUNT;i++){
            stars.push({
                x:(Math.random()-0.5)*canvas.width*15,
                y:(Math.random()-0.5)*canvas.height*15,
                z:Math.random()*5000+500,
                pz:0
            });
        }
        // Galaxy - 創建逼真的銀河系效果
        galaxyStars = [];
        const maxGalaxyStars = 2500; // 減少星星數量以提升性能
        
        // 創建不同顏色的星星紋理 - 降低亮度
        function createStarTexture(hue, saturation, lightness) {
            const starCanvas = document.createElement('canvas');
            const starCtx = starCanvas.getContext('2d');
            starCanvas.width = 100;
            starCanvas.height = 100;
            const half = starCanvas.width / 2;
            const starGradient = starCtx.createRadialGradient(half, half, 0, half, half, half);
            starGradient.addColorStop(0.025, `hsl(${hue}, ${saturation}%, ${Math.min(80, lightness + 15)}%)`); // 降低中心亮度
            starGradient.addColorStop(0.1, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
            starGradient.addColorStop(0.25, `hsl(${hue}, ${saturation}%, ${Math.max(5, lightness - 15)}%)`); // 降低邊緣亮度
            starGradient.addColorStop(1, 'transparent');
            starCtx.fillStyle = starGradient;
            starCtx.beginPath();
            starCtx.arc(half, half, half, 0, Math.PI * 2);
            starCtx.fill();
            return starCanvas;
        }
        
        // 計算真實銀河旋轉速度 - 基於銀河旋轉曲線
        function calculateGalaxyRotationSpeed(orbitRadius, maxRadius) {
            const normalizedRadius = orbitRadius / maxRadius; // 0 to 1
            
            // 真實銀河旋轉曲線的簡化模型
            let rotationSpeed;
            
            if (normalizedRadius < 0.1) {
                // 核心區域：固體旋轉，角速度隨半徑線性增加
                rotationSpeed = normalizedRadius * 0.002;
            } else if (normalizedRadius < 0.3) {
                // 內圈：快速上升到最大速度
                const t = (normalizedRadius - 0.1) / 0.2; // 0 to 1 in this range
                rotationSpeed = 0.0002 + t * 0.0018; // 上升到峰值
            } else if (normalizedRadius < 0.7) {
                // 中圈：維持較高的旋轉速度（平坦旋轉曲線）
                rotationSpeed = 0.002 * (1 - (normalizedRadius - 0.3) * 0.3);
            } else {
                // 外圈：逐漸減速
                const t = (normalizedRadius - 0.7) / 0.3;
                rotationSpeed = 0.0014 * (1 - t * 0.5);
            }
            
            // 添加隨機變化，模擬真實星星的軌道差異
            rotationSpeed *= (0.8 + Math.random() * 0.4); // ±20% 變化
            
            return rotationSpeed;
        }
        
        // 創建銀河系星星 - 重新設計螺旋臂結構以匹配圖片
        const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 50;
        for(let i = 0; i < maxGalaxyStars; i++){
            // 創建更密集的螺旋臂結構
            const isInSpiralArm = Math.random() < 0.85; // 85%的星星在螺旋臂中
            let orbitRadius, angle, armDensity = 1;
            
            if (isInSpiralArm) {
                // 螺旋臂分布 - 創建多條螺旋臂形成更複雜的結構
                const armIndex = Math.floor(Math.random() * 3); // 3條主要螺旋臂
                const armOffset = armIndex * (2 * Math.PI / 3); // 120度間隔
                
                // 螺旋臂密度區域
                const armCore = Math.random() < 0.6; // 60%在螺旋臂核心
                if (armCore) {
                    orbitRadius = Math.random() * maxRadius * 0.75 + maxRadius * 0.15;
                    armDensity = 2; // 螺旋臂核心更密集
                } else {
                    orbitRadius = Math.random() * maxRadius * 0.9 + maxRadius * 0.05;
                    armDensity = 1.5;
                }
                
                // 更緊密的螺旋結構
                const spiralTightness = 4.5; // 增加螺旋緊密度
                const baseAngle = (orbitRadius / maxRadius) * spiralTightness * Math.PI + armOffset;
                angle = baseAngle + (Math.random() - 0.5) * 0.6; // 減少隨機偏移
            } else {
                // 暈部分 - 更廣泛分布
                orbitRadius = Math.random() * maxRadius;
                angle = Math.random() * Math.PI * 2;
                armDensity = 0.5;
            }
            
            // 根據距離中心的位置決定星星顏色 - 減少粉色，最大顏色限制為紫色
            const distanceRatio = orbitRadius / maxRadius; // 0 = 中心, 1 = 外圍
            let hue, saturation, lightness;
            
            if (distanceRatio < 0.15) {
                // 核心區域：更亮的白色/淡黃色 (中心最亮)
                hue = 50 + Math.random() * 20; // 淡黃白色範圍
                saturation = Math.random() * 10; // 很低飽和度，更偏白色
                lightness = 70 + Math.random() * 20; // 大幅提高亮度 (70-90)
            } else if (distanceRatio < 0.35) {
                // 內圈區域：淡藍紫色
                hue = 250 + Math.random() * 30; // 藍紫色範圍 (250-280)
                saturation = 25 + Math.random() * 20; // 降低飽和度
                lightness = 45 + Math.random() * 15; // 亮度
            } else if (distanceRatio < 0.55) {
                // 中圈區域：藍紫色
                hue = 240 + Math.random() * 30; // 藍紫色範圍 (240-270)
                saturation = 45 + Math.random() * 30; // 中等飽和度
                lightness = 40 + Math.random() * 15; // 亮度
            } else if (distanceRatio < 0.75) {
                // 外中圈：深藍紫色
                hue = 230 + Math.random() * 30; // 深藍紫色範圍 (230-260)
                saturation = 55 + Math.random() * 25; // 高飽和度
                lightness = 35 + Math.random() * 15; // 亮度
            } else {
                // 最外圈：深藍色
                hue = 210 + Math.random() * 30; // 深藍色範圍 (210-240)
                saturation = 60 + Math.random() * 25; // 高飽和度
                lightness = 30 + Math.random() * 15; // 亮度
            }
            
            // 在螺旋臂中的星星更亮更飽和 - 減少增強效果
            if (isInSpiralArm) {
                lightness = Math.min(70, lightness + 3 * armDensity); // 減少亮度增強 (原本+8，現在+3)
                saturation = Math.min(85, saturation + 5 * armDensity); // 減少飽和度增強 (原本+10，現在+5)
            }
            
            galaxyStars.push({
                orbitRadius: orbitRadius,
                radius: Math.random() * (60 - orbitRadius / 15) / 15 + orbitRadius / 20, // 縮小星星尺寸
                orbitX: 0, // 設為0，因為會在變換後的座標系中繪製
                orbitY: 0, // 設為0，因為會在變換後的座標系中繪製
                timePassed: angle, // 使用計算出的角度作為初始位置
                // 真實銀河旋轉速度 - 基於銀河旋轉曲線
                speed: calculateGalaxyRotationSpeed(orbitRadius, maxRadius),
                alpha: (Math.random() * 3 + 1) / 10 * armDensity, // 降低透明度範圍
                starTexture: createStarTexture(hue, saturation, lightness),
                isInSpiralArm: isInSpiralArm,
                armDensity: armDensity
            });
        }
        phase='meteors';frame=0;explosionFrames=0;travelFrames=0;galaxyFrames=0;
        requestAnimationFrame(draw);
    }
    
    // Function to draw a single meteor
    function drawMeteor(meteor) {
        // 先绘制火花（在陨石后方）
        if (phase === 'meteors' && Math.random() < 0.6) { // 从30%增加到60%概率生成火花
            createSparkles(meteor.x, meteor.y, meteor.dx, meteor.dy, 4); // 每次生成4个火花
        }
        
        // 然后绘制陨石（在火花前方）
        if (useCustomImages && meteorImages[meteor.imageIndex] && meteorImages[meteor.imageIndex] !== null) {
            drawImageMeteor(meteor);
        } else {
            // 如果图片未加载成功，使用默认绘制
            drawDefaultMeteor(meteor);
        }
    }

    // 使用图片绘制陨石
    function drawImageMeteor(meteor) {
        const image = meteorImages[meteor.imageIndex];
        if (!image) return;
        
        ctx.save();
        
        // 移动到陨石位置
        ctx.translate(meteor.x, meteor.y);
        
        // 应用自转旋转
        ctx.rotate(meteor.rotation);
        
        // 绘制陨石图片
        const imageSize = 100; // 增加陨石图片大小 (从60增加到100)
        ctx.drawImage(image, -imageSize/2, -imageSize/2, imageSize, imageSize);
        
        ctx.restore();
        
        // 更新旋转角度
        meteor.rotation += meteor.rotationSpeed;
    }

    // 簡化的隕石繪製函數 - 只显示旋转的圆形陨石
    function drawDefaultMeteor(meteor) {
        const headRadius = 50; // 增加陨石大小 (从30增加到50)
        
        ctx.save();
        
        // 移动到陨石位置
        ctx.translate(meteor.x, meteor.y);
        
        // 应用自转旋转（用于纹理效果）
        ctx.rotate(meteor.rotation || 0);
        
        // 隕石本體 - 简单的灰色圆形带纹理
        ctx.beginPath();
        const rockGradient = ctx.createRadialGradient(
            -headRadius * 0.3, -headRadius * 0.3, 0,
            0, 0, headRadius
        );
        rockGradient.addColorStop(0, '#8B7355'); // 淺灰褐色
        rockGradient.addColorStop(0.6, '#5D4E37'); // 深褐色
        rockGradient.addColorStop(1, '#3C2415'); // 暗褐色邊緣
        
        ctx.fillStyle = rockGradient;
        ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // 更新旋转角度
        if (meteor.rotation !== undefined) {
            meteor.rotation += meteor.rotationSpeed || 0.01;
        }
    }

    // 繪製超逼真隕石的函數 - 仿照真實隕石圖片效果
    function drawRealisticMeteor(m, frame) {
        const x = m.x;
        const y = m.y;
        const dx = m.dx;
        const dy = m.dy;
        const speed = Math.hypot(dx, dy);
        
        // 計算隕石移動角度
        const angle = Math.atan2(dy, dx);
        
        // 動態效果參數
        const timeBasedFlicker = Math.sin(frame * 0.15) * 0.3 + 0.7; // 整體閃爍
        const coreFlicker = Math.sin(frame * 0.25) * 0.4 + 0.8; // 核心閃爍
        const shockwaveFlicker = Math.sin(frame * 0.1) * 0.2 + 0.9; // 衝擊波閃爍
        
        ctx.save();
        
        // === 第一層：超遠距離藍白色衝擊波 ===
        const outerShockwaveGradient = ctx.createRadialGradient(x, y, 0, x, y, 120 * shockwaveFlicker);
        outerShockwaveGradient.addColorStop(0, 'rgba(220, 240, 255, 0.15)');  // 極淡藍白
        outerShockwaveGradient.addColorStop(0.3, 'rgba(180, 220, 255, 0.12)'); // 淡藍白
        outerShockwaveGradient.addColorStop(0.6, 'rgba(120, 180, 255, 0.08)'); // 藍色
        outerShockwaveGradient.addColorStop(0.8, 'rgba(80, 140, 255, 0.04)');  // 深藍
        outerShockwaveGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = outerShockwaveGradient;
        ctx.beginPath();
        ctx.arc(x, y, 120 * shockwaveFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 第二層：中距離電離層效果 ===
        const ionizationGradient = ctx.createRadialGradient(x, y, 0, x, y, 90 * timeBasedFlicker);
        ionizationGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');        // 白熱中心
        ionizationGradient.addColorStop(0.2, 'rgba(200, 220, 255, 0.35)');     // 電離藍白
        ionizationGradient.addColorStop(0.4, 'rgba(150, 200, 255, 0.28)');     // 等離子藍
        ionizationGradient.addColorStop(0.6, 'rgba(100, 160, 255, 0.20)');     // 深藍等離子
        ionizationGradient.addColorStop(0.8, 'rgba(60, 120, 255, 0.12)');      // 外層電離
        ionizationGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = ionizationGradient;
        ctx.beginPath();
        ctx.arc(x, y, 90 * timeBasedFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 第三層：高溫燃燒外環 ===
        const burningRingGradient = ctx.createRadialGradient(x, y, 0, x, y, 70 * timeBasedFlicker);
        burningRingGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');       // 超白熱中心
        burningRingGradient.addColorStop(0.15, 'rgba(255, 240, 200, 0.65)');   // 淡黃白
        burningRingGradient.addColorStop(0.3, 'rgba(255, 220, 150, 0.6)');     // 暖橙黃
        burningRingGradient.addColorStop(0.5, 'rgba(255, 180, 100, 0.5)');     // 亮橙色
        burningRingGradient.addColorStop(0.7, 'rgba(255, 120, 60, 0.4)');      // 橙紅色
        burningRingGradient.addColorStop(0.85, 'rgba(255, 80, 40, 0.25)');     // 深橙紅
        burningRingGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = burningRingGradient;
        ctx.beginPath();
        ctx.arc(x, y, 70 * timeBasedFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 第四層：熾熱火焰核心 ===
        const flameGradient = ctx.createRadialGradient(x, y, 0, x, y, 45 * timeBasedFlicker);
        flameGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');            // 純白核心
        flameGradient.addColorStop(0.2, 'rgba(255, 255, 220, 0.85)');          // 白黃色
        flameGradient.addColorStop(0.4, 'rgba(255, 230, 180, 0.75)');          // 淡橙黃
        flameGradient.addColorStop(0.6, 'rgba(255, 200, 120, 0.65)');          // 橙黃色
        flameGradient.addColorStop(0.8, 'rgba(255, 150, 80, 0.5)');            // 橙色
        flameGradient.addColorStop(1, 'rgba(255, 100, 50, 0.3)');              // 橙紅邊緣
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(x, y, 45 * timeBasedFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 第五層：超亮白色核心 ===
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 25 * coreFlicker);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');                // 最亮白色
        coreGradient.addColorStop(0.3, 'rgba(255, 255, 240, 0.95)');           // 極淡黃白
        coreGradient.addColorStop(0.6, 'rgba(255, 240, 220, 0.8)');            // 暖白色
        coreGradient.addColorStop(0.8, 'rgba(255, 220, 180, 0.6)');            // 淡橙白
        coreGradient.addColorStop(1, 'rgba(255, 200, 140, 0.4)');              // 橙色邊緣
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, 25 * coreFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 第六層：極亮內核 ===
        const innerCoreGradient = ctx.createRadialGradient(x, y, 0, x, y, 12 * coreFlicker);
        innerCoreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');           // 純白
        innerCoreGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');       // 白色
        innerCoreGradient.addColorStop(1, 'rgba(255, 240, 200, 0.7)');         // 淡黃邊緣
        
        ctx.fillStyle = innerCoreGradient;
        ctx.beginPath();
        ctx.arc(x, y, 12 * coreFlicker, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 動態脈衝效果 ===
        const pulseIntensity = Math.abs(Math.sin(frame * 0.2)) * 0.5 + 0.3;
        const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${pulseIntensity})`);
        pulseGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // === 繪製超真實火焰尾巴 ===
        const tailLength = 350;
        const maxTailWidth = 25; // 稍微減少寬度讓尾巴更精細
        const turbulenceStrength = 1.2; // 增加湍流強度
        
        // 創建更自然的火焰層次
        for (let layer = 0; layer < 4; layer++) {
            const layerIntensity = 1 - (layer * 0.25); // 每層強度遞減
            const layerLength = tailLength * (0.7 + layerIntensity * 0.3);
            const layerWidth = maxTailWidth * layerIntensity;
            
            // 火焰起始點（隕石後方稍微偏移）
            const startOffset = 25 + layer * 5;
            const startX = x - Math.cos(angle) * startOffset;
            const startY = y - Math.sin(angle) * startOffset;
            
            // 創建不規則的火焰輪廓
            const flamePoints = 20;
            const leftEdge = [];
            const rightEdge = [];
            
            for (let i = 0; i <= flamePoints; i++) {
                const t = i / flamePoints;
                const progress = Math.pow(t, 0.6); // 更自然的衰減曲線
                
                // 基礎位置
                const baseX = startX - Math.cos(angle) * layerLength * progress;
                const baseY = startY - Math.sin(angle) * layerLength * progress;
                
                // 計算當前位置的火焰寬度（錐形衰減）
                const widthFactor = Math.pow(1 - progress, 0.4);
                const currentWidth = layerWidth * widthFactor;
                
                // 添加多重湊流效果
                let turbulence = 0;
                
                // 大尺度湍流（主要形狀變化）
                turbulence += Math.sin(progress * Math.PI * 3 + frame * 0.15 + layer) * turbulenceStrength;
                
                // 中尺度湊流（細節波動）
                turbulence += Math.sin(progress * Math.PI * 8 + frame * 0.25 + layer * 2) * turbulenceStrength * 0.5;
                
                // 小尺度湙流（高頻細節）
                turbulence += Math.sin(progress * Math.PI * 15 + frame * 0.4 + layer * 3) * turbulenceStrength * 0.25;
                
                // 隨機擾動（模擬火焰的不可預測性）
                if (Math.random() < 0.15) {
                    turbulence += (Math.random() - 0.5) * turbulenceStrength * 2;
                }
                
                // 應用湍流到火焰邊緣
                const perpAngle = angle + Math.PI / 2;
                const turbulenceOffset = turbulence * currentWidth * 0.6;
                
                // 不對稱擾動（真實火焰通常不完全對稱）
                const asymmetryFactor = Math.sin(progress * Math.PI * 2 + frame * 0.1) * 0.3;
                
                leftEdge.push({
                    x: baseX + Math.cos(perpAngle) * (currentWidth * 0.5 + turbulenceOffset + asymmetryFactor),
                    y: baseY + Math.sin(perpAngle) * (currentWidth * 0.5 + turbulenceOffset + asymmetryFactor)
                });
                
                rightEdge.push({
                    x: baseX - Math.cos(perpAngle) * (currentWidth * 0.5 - turbulenceOffset + asymmetryFactor),
                    y: baseY - Math.sin(perpAngle) * (currentWidth * 0.5 - turbulenceOffset + asymmetryFactor)
                });
            }
            
            // 創建更真實的火焰顏色漸變
            const tailGradient = ctx.createLinearGradient(startX, startY, 
                startX - Math.cos(angle) * layerLength, 
                startY - Math.sin(angle) * layerLength);
            
            const baseAlpha = 0.9 - layer * 0.15;
            
            if (layer === 0) {
                // 最外層 - 深紅色煙霧效果，更長的淡化距離
                tailGradient.addColorStop(0, `hsla(8, 85%, 45%, ${baseAlpha * 0.7})`);
                tailGradient.addColorStop(0.15, `hsla(5, 80%, 40%, ${baseAlpha * 0.5})`);
                tailGradient.addColorStop(0.35, `hsla(0, 75%, 35%, ${baseAlpha * 0.3})`);
                tailGradient.addColorStop(0.6, `hsla(355, 70%, 25%, ${baseAlpha * 0.15})`);
                tailGradient.addColorStop(0.75, `hsla(350, 65%, 20%, ${baseAlpha * 0.08})`);
                tailGradient.addColorStop(0.85, `hsla(345, 60%, 15%, ${baseAlpha * 0.04})`);
                tailGradient.addColorStop(0.92, `hsla(340, 55%, 10%, ${baseAlpha * 0.02})`);
                tailGradient.addColorStop(0.96, `hsla(335, 50%, 8%, ${baseAlpha * 0.01})`);
                tailGradient.addColorStop(1, 'transparent');
            } else if (layer === 1) {
                // 外層 - 橙紅色主體，平滑的漸變淡化
                tailGradient.addColorStop(0, `hsla(18, 95%, 55%, ${baseAlpha})`);
                tailGradient.addColorStop(0.2, `hsla(15, 90%, 50%, ${baseAlpha * 0.8})`);
                tailGradient.addColorStop(0.4, `hsla(10, 85%, 45%, ${baseAlpha * 0.6})`);
                tailGradient.addColorStop(0.6, `hsla(5, 80%, 35%, ${baseAlpha * 0.4})`);
                tailGradient.addColorStop(0.75, `hsla(2, 75%, 25%, ${baseAlpha * 0.25})`);
                tailGradient.addColorStop(0.85, `hsla(358, 70%, 18%, ${baseAlpha * 0.12})`);
                tailGradient.addColorStop(0.92, `hsla(355, 65%, 12%, ${baseAlpha * 0.06})`);
                tailGradient.addColorStop(0.97, `hsla(352, 60%, 8%, ${baseAlpha * 0.02})`);
                tailGradient.addColorStop(1, 'transparent');
            } else if (layer === 2) {
                // 中層 - 橙黃色熱核，自然淡化
                tailGradient.addColorStop(0, `hsla(35, 100%, 65%, ${baseAlpha})`);
                tailGradient.addColorStop(0.25, `hsla(30, 95%, 60%, ${baseAlpha * 0.85})`);
                tailGradient.addColorStop(0.5, `hsla(25, 90%, 55%, ${baseAlpha * 0.7})`);
                tailGradient.addColorStop(0.7, `hsla(20, 85%, 45%, ${baseAlpha * 0.5})`);
                tailGradient.addColorStop(0.8, `hsla(15, 80%, 35%, ${baseAlpha * 0.3})`);
                tailGradient.addColorStop(0.88, `hsla(10, 75%, 25%, ${baseAlpha * 0.15})`);
                tailGradient.addColorStop(0.94, `hsla(5, 70%, 18%, ${baseAlpha * 0.07})`);
                tailGradient.addColorStop(0.98, `hsla(2, 65%, 12%, ${baseAlpha * 0.03})`);
                tailGradient.addColorStop(1, 'transparent');
            } else {
                // 內層 - 白熱核心，最平滑的淡化
                tailGradient.addColorStop(0, `hsla(50, 100%, 80%, ${baseAlpha})`);
                tailGradient.addColorStop(0.15, `hsla(48, 95%, 75%, ${baseAlpha * 0.9})`);
                tailGradient.addColorStop(0.3, `hsla(45, 90%, 70%, ${baseAlpha * 0.8})`);
                tailGradient.addColorStop(0.5, `hsla(40, 85%, 65%, ${baseAlpha * 0.6})`);
                tailGradient.addColorStop(0.65, `hsla(35, 80%, 55%, ${baseAlpha * 0.4})`);
                tailGradient.addColorStop(0.75, `hsla(30, 75%, 45%, ${baseAlpha * 0.25})`);
                tailGradient.addColorStop(0.83, `hsla(25, 70%, 35%, ${baseAlpha * 0.15})`);
                tailGradient.addColorStop(0.9, `hsla(20, 65%, 25%, ${baseAlpha * 0.08})`);
                tailGradient.addColorStop(0.95, `hsla(15, 60%, 18%, ${baseAlpha * 0.04})`);
                tailGradient.addColorStop(0.98, `hsla(10, 55%, 12%, ${baseAlpha * 0.02})`);
                tailGradient.addColorStop(1, 'transparent');
            }
            
            // 使用更柔和的混合模式
            if (layer === 0) {
                ctx.globalCompositeOperation = 'normal';
            } else {
                ctx.globalCompositeOperation = 'screen';
            }
            
            // 繪製火焰形狀
            ctx.fillStyle = tailGradient;
            ctx.beginPath();
            
            // 起始點
            ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
            
            // 左邊緣（使用貝塞爾曲線讓線條更平滑）
            for (let i = 1; i < leftEdge.length; i++) {
                if (i < leftEdge.length - 1) {
                    const midX = (leftEdge[i].x + leftEdge[i + 1].x) / 2;
                    const midY = (leftEdge[i].y + leftEdge[i + 1].y) / 2;
                    ctx.quadraticCurveTo(leftEdge[i].x, leftEdge[i].y, midX, midY);
                } else {
                    ctx.lineTo(leftEdge[i].x, leftEdge[i].y);
                }
            }
            
            // 右邊緣（反向）
            for (let i = rightEdge.length - 1; i >= 0; i--) {
                if (i > 0) {
                    const midX = (rightEdge[i].x + rightEdge[i - 1].x) / 2;
                    const midY = (rightEdge[i].y + rightEdge[i - 1].y) / 2;
                    ctx.quadraticCurveTo(rightEdge[i].x, rightEdge[i].y, midX, midY);
                } else {
                    ctx.lineTo(rightEdge[i].x, rightEdge[i].y);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // 隨機添加火焰邊緣的光暈效果
            if (layer > 0 && Math.random() < 0.2) {
                ctx.shadowBlur = 8 + layer * 4;
                ctx.shadowColor = layer === 3 ? 'rgba(255, 240, 200, 0.6)' : 'rgba(255, 120, 60, 0.4)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            ctx.globalCompositeOperation = 'source-over';
        }
        
        // === 繪製火焰尾巴（在隕石本體之前）===
        ctx.save();
        
        // 創建多層火焰尾巴效果
        for (let layer = 0; layer < 5; layer++) {
            const layerIntensity = 1 - (layer * 0.2); // 每層強度遞減
            const layerLength = tailLength * (0.6 + layerIntensity * 0.4);
            const layerWidth = maxTailWidth * layerIntensity;
            
            // 火焰起始點（隕石後方）
            const startOffset = 30 + layer * 8;
            const startX = x - Math.cos(angle) * startOffset;
            const startY = y - Math.sin(angle) * startOffset;
            
            // 創建不規則火焰輪廓
            const flamePoints = 25;
            const leftEdge = [];
            const rightEdge = [];
            
            for (let i = 0; i <= flamePoints; i++) {
                const t = i / flamePoints;
                const progress = Math.pow(t, 0.7); // 更自然的衰減
                
                const baseX = startX - Math.cos(angle) * layerLength * progress;
                const baseY = startY - Math.sin(angle) * layerLength * progress;
                
                const widthFactor = Math.pow(1 - progress, 0.5);
                const currentWidth = layerWidth * widthFactor;
                
                // 高頻湊流效果
                let turbulence = 0;
                turbulence += Math.sin(progress * Math.PI * 4 + frame * 0.2 + layer) * turbulenceStrength;
                turbulence += Math.sin(progress * Math.PI * 12 + frame * 0.35 + layer * 2) * turbulenceStrength * 0.6;
                turbulence += Math.sin(progress * Math.PI * 20 + frame * 0.5 + layer * 3) * turbulenceStrength * 0.3;
                
                if (Math.random() < 0.2) {
                    turbulence += (Math.random() - 0.5) * turbulenceStrength * 3;
                }
                
                const perpAngle = angle + Math.PI / 2;
                const turbulenceOffset = turbulence * currentWidth * 0.7;
                const asymmetryFactor = Math.sin(progress * Math.PI * 3 + frame * 0.15) * 0.4;
                
                leftEdge.push({
                    x: baseX + Math.cos(perpAngle) * (currentWidth * 0.5 + turbulenceOffset + asymmetryFactor),
                    y: baseY + Math.sin(perpAngle) * (currentWidth * 0.5 + turbulenceOffset + asymmetryFactor)
                });
                
                rightEdge.push({
                    x: baseX - Math.cos(perpAngle) * (currentWidth * 0.5 - turbulenceOffset + asymmetryFactor),
                    y: baseY - Math.sin(perpAngle) * (currentWidth * 0.5 - turbulenceOffset + asymmetryFactor)
                });
            }
            
            // 創建火焰顏色漸變
            const tailFireGradient = ctx.createLinearGradient(startX, startY, 
                startX - Math.cos(angle) * layerLength, 
                startY - Math.sin(angle) * layerLength);
            
            const baseAlpha = (0.9 - layer * 0.15) * timeBasedFlicker;
            
            if (layer === 0) {
                // 最外層 - 深紅煙霧
                tailFireGradient.addColorStop(0, `hsla(8, 85%, 45%, ${baseAlpha * 0.8})`);
                tailFireGradient.addColorStop(0.2, `hsla(5, 80%, 40%, ${baseAlpha * 0.6})`);
                tailFireGradient.addColorStop(0.4, `hsla(0, 75%, 35%, ${baseAlpha * 0.4})`);
                tailFireGradient.addColorStop(0.6, `hsla(355, 70%, 25%, ${baseAlpha * 0.25})`);
                tailFireGradient.addColorStop(0.75, `hsla(350, 65%, 20%, ${baseAlpha * 0.15})`);
                tailFireGradient.addColorStop(0.85, `hsla(345, 60%, 15%, ${baseAlpha * 0.08})`);
                tailFireGradient.addColorStop(0.93, `hsla(340, 55%, 10%, ${baseAlpha * 0.04})`);
                tailFireGradient.addColorStop(0.97, `hsla(335, 50%, 8%, ${baseAlpha * 0.02})`);
                tailFireGradient.addColorStop(1, 'transparent');
            } else if (layer === 1) {
                // 外層 - 橙紅主體
                tailFireGradient.addColorStop(0, `hsla(18, 95%, 55%, ${baseAlpha})`);
                tailFireGradient.addColorStop(0.25, `hsla(15, 90%, 50%, ${baseAlpha * 0.85})`);
                tailFireGradient.addColorStop(0.45, `hsla(10, 85%, 45%, ${baseAlpha * 0.7})`);
                tailFireGradient.addColorStop(0.65, `hsla(5, 80%, 35%, ${baseAlpha * 0.5})`);
                tailFireGradient.addColorStop(0.78, `hsla(2, 75%, 25%, ${baseAlpha * 0.3})`);
                tailFireGradient.addColorStop(0.87, `hsla(358, 70%, 18%, ${baseAlpha * 0.18})`);
                tailFireGradient.addColorStop(0.93, `hsla(355, 65%, 12%, ${baseAlpha * 0.1})`);
                tailFireGradient.addColorStop(0.97, `hsla(352, 60%, 8%, ${baseAlpha * 0.05})`);
                tailFireGradient.addColorStop(1, 'transparent');
            } else if (layer === 2) {
                // 中層 - 橙黃色熱核
                tailFireGradient.addColorStop(0, `hsla(35, 100%, 65%, ${baseAlpha})`);
                tailFireGradient.addColorStop(0.3, `hsla(30, 95%, 60%, ${baseAlpha * 0.9})`);
                tailFireGradient.addColorStop(0.5, `hsla(25, 90%, 55%, ${baseAlpha * 0.7})`);
                tailFireGradient.addColorStop(0.7, `hsla(20, 85%, 45%, ${baseAlpha * 0.5})`);
                tailFireGradient.addColorStop(0.82, `hsla(15, 80%, 35%, ${baseAlpha * 0.4})`);
                tailFireGradient.addColorStop(0.9, `hsla(10, 75%, 25%, ${baseAlpha * 0.25})`);
                tailFireGradient.addColorStop(0.95, `hsla(5, 70%, 18%, ${baseAlpha * 0.12})`);
                tailFireGradient.addColorStop(0.98, `hsla(2, 65%, 12%, ${baseAlpha * 0.06})`);
                tailFireGradient.addColorStop(1, 'transparent');
            } else if (layer === 3) {
                // 內熱層 - 黃白核心
                tailFireGradient.addColorStop(0, `hsla(50, 100%, 80%, ${baseAlpha})`);
                tailFireGradient.addColorStop(0.2, `hsla(48, 95%, 75%, ${baseAlpha * 0.95})`);
                tailFireGradient.addColorStop(0.35, `hsla(45, 90%, 70%, ${baseAlpha * 0.85})`);
                tailFireGradient.addColorStop(0.55, `hsla(40, 85%, 65%, ${baseAlpha * 0.7})`);
                tailFireGradient.addColorStop(0.7, `hsla(35, 80%, 55%, ${baseAlpha * 0.5})`);
                tailFireGradient.addColorStop(0.8, `hsla(30, 75%, 45%, ${baseAlpha * 0.35})`);
                tailFireGradient.addColorStop(0.88, `hsla(25, 70%, 35%, ${baseAlpha * 0.2})`);
                tailFireGradient.addColorStop(0.94, `hsla(20, 65%, 25%, ${baseAlpha * 0.1})`);
                tailFireGradient.addColorStop(0.97, `hsla(15, 60%, 18%, ${baseAlpha * 0.05})`);
                tailFireGradient.addColorStop(1, 'transparent');
            } else {
                // 最內層 - 純白熱核心
                tailGradient.addColorStop(0, `hsla(60, 100%, 95%, ${baseAlpha})`);
                tailGradient.addColorStop(0.15, `hsla(58, 95%, 90%, ${baseAlpha * 0.95})`);
                tailGradient.addColorStop(0.3, `hsla(55, 90%, 85%, ${baseAlpha * 0.9})`);
                tailGradient.addColorStop(0.5, `hsla(50, 85%, 80%, ${baseAlpha * 0.8})`);
                tailGradient.addColorStop(0.65, `hsla(45, 80%, 70%, ${baseAlpha * 0.6})`);
                tailGradient.addColorStop(0.75, `hsla(40, 75%, 60%, ${baseAlpha * 0.45})`);
                tailGradient.addColorStop(0.83, `hsla(35, 70%, 50%, ${baseAlpha * 0.3})`);
                tailGradient.addColorStop(0.9, `hsla(30, 65%, 40%, ${baseAlpha * 0.18})`);
                tailGradient.addColorStop(0.95, `hsla(25, 60%, 30%, ${baseAlpha * 0.1})`);
                tailGradient.addColorStop(0.98, `hsla(20, 55%, 20%, ${baseAlpha * 0.05})`);
                tailGradient.addColorStop(1, 'transparent');
            }
            
            // 設置混合模式
            if (layer === 0) {
                ctx.globalCompositeOperation = 'normal';
            } else {
                ctx.globalCompositeOperation = 'screen';
            }
            
            // 繪製火焰形狀
            ctx.fillStyle = tailGradient;
            ctx.beginPath();
            ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
            
            // 左邊緣（使用貝塞爾曲線讓線條更平滑）
            for (let i = 1; i < leftEdge.length; i++) {
                if (i < leftEdge.length - 1) {
                    const midX = (leftEdge[i].x + leftEdge[i + 1].x) / 2;
                    const midY = (leftEdge[i].y + leftEdge[i + 1].y) / 2;
                    ctx.quadraticCurveTo(leftEdge[i].x, leftEdge[i].y, midX, midY);
                } else {
                    ctx.lineTo(leftEdge[i].x, leftEdge[i].y);
                }
            }
            
            // 右邊緣（反向）
            for (let i = rightEdge.length - 1; i >= 0; i--) {
                if (i > 0) {
                    const midX = (rightEdge[i].x + rightEdge[i - 1].x) / 2;
                    const midY = (rightEdge[i].y + rightEdge[i - 1].y) / 2;
                    ctx.quadraticCurveTo(rightEdge[i].x, rightEdge[i].y, midX, midY);
                } else {
                    ctx.lineTo(rightEdge[i].x, rightEdge[i].y);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // 添加火焰光暈
            if (layer > 1 && Math.random() < 0.3) {
                ctx.shadowBlur = 12 + layer * 6;
                ctx.shadowColor = layer === 4 ? 'rgba(255, 255, 240, 0.8)' : 'rgba(255, 180, 100, 0.6)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
    }
    
    // 繪製隕石尾巴的函數
    function drawMeteorTrail(meteor) {
        const speed = Math.sqrt(meteor.dx * meteor.dx + meteor.dy * meteor.dy);
        if (speed > 0.1) {
            const tailLength = 80 + speed * 6; // 尾巴長度
            const angle = Math.atan2(meteor.dy, meteor.dx);
            
            // 計算尾巴的三角形頂點
            const tailBaseWidth = 15;
            const tailBaseOffsetX = Math.cos(angle + Math.PI / 2) * tailBaseWidth;
            const tailBaseOffsetY = Math.sin(angle + Math.PI / 2) * tailBaseWidth;
            
            const x1 = meteor.x + tailBaseOffsetX;
            const y1 = meteor.y + tailBaseOffsetY;
            const x2 = meteor.x - tailBaseOffsetX;
            const y2 = meteor.y - tailBaseOffsetY;
            
            // 尾巴尖端
            const tailTipX = meteor.x - Math.cos(angle) * tailLength;
            const tailTipY = meteor.y - Math.sin(angle) * tailLength;
            
            // 繪製火焰尾巴
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(tailTipX, tailTipY);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            
            // 火焰漸變
            const tailGradient = ctx.createLinearGradient(meteor.x, meteor.y, tailTipX, tailTipY);
            tailGradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // 最亮的白色
            tailGradient.addColorStop(0.2, 'rgba(255, 220, 150, 0.9)'); // 亮黃橙色
            tailGradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.7)'); // 橙色
            tailGradient.addColorStop(0.7, 'rgba(255, 69, 0, 0.5)'); // 紅橙色
            tailGradient.addColorStop(1, 'rgba(139, 0, 0, 0)'); // 透明深紅色
            
            ctx.fillStyle = tailGradient;
            ctx.fill();
            
            // 添加內層更亮的尾巴
            ctx.beginPath();
            ctx.moveTo(meteor.x + tailBaseOffsetX * 0.5, meteor.y + tailBaseOffsetY * 0.5);
            ctx.lineTo(meteor.x - Math.cos(angle) * tailLength * 0.6, meteor.y - Math.sin(angle) * tailLength * 0.6);
            ctx.lineTo(meteor.x - tailBaseOffsetX * 0.5, meteor.y - tailBaseOffsetY * 0.5);
            ctx.closePath();
            
            const innerTailGradient = ctx.createLinearGradient(meteor.x, meteor.y, 
                meteor.x - Math.cos(angle) * tailLength * 0.6, meteor.y - Math.sin(angle) * tailLength * 0.6);
            innerTailGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            innerTailGradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.6)');
            innerTailGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
            
            ctx.fillStyle = innerTailGradient;
            ctx.fill();
        }
    }

    // 繪製銀河系星星的函數 - 增強螺旋臂效果
    function drawGalaxyStar(star) {
        const x = Math.sin(star.timePassed) * star.orbitRadius + star.orbitX;
        const y = Math.cos(star.timePassed) * star.orbitRadius + star.orbitY;
        const twinkle = Math.floor(Math.random() * 10);
        
        // 星星閃爍效果
        if (twinkle === 1 && star.alpha > 0.1) {
            star.alpha -= 0.02;
        } else if (twinkle === 2 && star.alpha < 0.7) {
            star.alpha += 0.02;
        }
        
        // 如果是螺旋臂中的星星，添加額外光暈 - 降低光暈亮度
        if (star.isInSpiralArm && star.armDensity > 1) {
            const glowSize = star.radius * 2;
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            glowGradient.addColorStop(0, `hsla(300, 80%, 40%, ${star.alpha * 0.15})`); // 降低亮度和透明度
            glowGradient.addColorStop(0.5, `hsla(280, 70%, 30%, ${star.alpha * 0.08})`); // 降低亮度和透明度
            glowGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = star.alpha;
        ctx.drawImage(star.starTexture, 
                     x - star.radius / 2, 
                     y - star.radius / 2, 
                     star.radius, 
                     star.radius);
        
        star.timePassed += star.speed;
    }
    
    // 繪製神秘科技風格文字的函數
    function drawMysteriousText() {
        if (!textAnimationActive) return;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2; // 所有文字都在同一个高度（屏幕中央）
        
        // 只显示当前行文字，计算淡入淡出效果
        if (currentTextLine < MYSTERIOUS_TEXT.length) {
            const text = MYSTERIOUS_TEXT[currentTextLine];
            let alpha = 0;
            let scale = 1;
            
            // 根据当前帧数计算淡入淡出效果
            if (textAppearFrames <= TEXT_FADE_IN_DURATION) {
                // 淡入阶段
                const fadeInProgress = textAppearFrames / TEXT_FADE_IN_DURATION;
                alpha = fadeInProgress;
                scale = 0.8 + 0.2 * fadeInProgress;
            } else if (textAppearFrames <= TEXT_FADE_IN_DURATION + TEXT_DISPLAY_DURATION) {
                // 完全显示阶段
                alpha = 1;
                scale = 1;
            } else if (textAppearFrames <= TEXT_TOTAL_DURATION) {
                // 淡出阶段
                const fadeOutProgress = (textAppearFrames - TEXT_FADE_IN_DURATION - TEXT_DISPLAY_DURATION) / TEXT_FADE_OUT_DURATION;
                alpha = 1 - fadeOutProgress;
                scale = 1 - 0.2 * fadeOutProgress;
            }
            
            // 只有当alpha大于0时才绘制文字
            if (alpha > 0) {
                drawTechText(text, cx, cy, alpha, scale, currentTextLine);
            }
        }
        
        // 更新動畫計時器
        textAppearFrames++;
        
        // 檢查是否需要顯示下一行
        if (textAppearFrames >= TEXT_TOTAL_DURATION && currentTextLine < MYSTERIOUS_TEXT.length - 1) {
            currentTextLine++;
            textAppearFrames = 0;
        }
        
        // 檢查是否所有文字都已完成並啟動星際穿梭
        if (currentTextLine >= MYSTERIOUS_TEXT.length - 1 && textAppearFrames >= TEXT_TOTAL_DURATION && !hyperspaceActive) {
            // 延迟启动星际穿梭
            if (hyperspaceFrames < HYPERSPACE_DELAY) {
                hyperspaceFrames++;
            } else {
                hyperspaceActive = true;
                hyperspaceFrames = 0;
            }
        }
    }
    
    // 繪製星際穿梭效果 - 銀河系衝撞放大效果
    function drawHyperspaceEffect() {
        if (!hyperspaceActive) return;
        
        hyperspaceFrames++;
        
        // 銀河系衝撞放大效果
        const hyperspaceProgress = hyperspaceFrames / HYPERSPACE_DURATION;
        const zoomScale = 1 + Math.pow(hyperspaceProgress, 2) * 100; // 使用平方加速，最終放大100倍
        
        // 計算銀河系旋轉速度（隨著放大加速旋轉）
        const rotationSpeed = hyperspaceProgress * 0.05;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoomScale, zoomScale);
        ctx.rotate(hyperspaceFrames * rotationSpeed);
        
        // 繪製完整的銀河系（重現銀河系階段的視覺效果）
        const maxRadius = Math.min(canvas.width, canvas.height) / 2;
        
        // 主要螺旋星云背景 - 3條螺旋臂（與銀河系階段相同）
        for (let arm = 0; arm < 3; arm++) {
            const armOffset = arm * (2 * Math.PI / 3);
            
            for (let radius = 40; radius < maxRadius; radius += 25) { // 增加密度
                const spiralAngle = (radius / maxRadius) * 4.5 * Math.PI + armOffset;
                
                for (let offset = 0; offset < 3; offset++) { // 增加數量
                    const offsetAngle = spiralAngle + offset * 0.3;
                    const x = Math.cos(offsetAngle) * radius;
                    const y = Math.sin(offsetAngle) * radius;
                    
                    const distanceRatio = radius / maxRadius;
                    let nebulaHue, nebulaSaturation, nebulaLightness, nebulaSize;
                    
                    if (distanceRatio < 0.2) {
                        nebulaHue = 50;
                        nebulaSaturation = 30;
                        nebulaLightness = 85;
                        nebulaSize = 120;
                    } else if (distanceRatio < 0.4) {
                        nebulaHue = 260;
                        nebulaSaturation = 60;
                        nebulaLightness = 65;
                        nebulaSize = 100;
                    } else if (distanceRatio < 0.6) {
                        nebulaHue = 240;
                        nebulaSaturation = 70;
                        nebulaLightness = 55;
                        nebulaSize = 90;
                    } else if (distanceRatio < 0.8) {
                        nebulaHue = 230;
                        nebulaSaturation = 75;
                        nebulaLightness = 45;
                        nebulaSize = 80;
                    } else {
                        nebulaHue = 220;
                        nebulaSaturation = 80;
                        nebulaLightness = 40;
                        nebulaSize = 70;
                    }
                    
                    // 隨著放大，星云變得更亮更強烈
                    const intensityBoost = 1 + hyperspaceProgress * 2;
                    nebulaLightness = Math.min(90, nebulaLightness * intensityBoost);
                    
                    const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, nebulaSize);
                    nebulaGradient.addColorStop(0, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness}%, ${0.3 * intensityBoost})`);
                    nebulaGradient.addColorStop(0.3, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness - 5}%, ${0.2 * intensityBoost})`);
                    nebulaGradient.addColorStop(0.6, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness - 10}%, ${0.1 * intensityBoost})`);
                    nebulaGradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = nebulaGradient;
                    ctx.beginPath();
                    ctx.arc(x, y, nebulaSize, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
        
        // 繪製銀河系星星（隨著放大變得更亮）
        ctx.globalCompositeOperation = 'lighter';
        galaxyStars.forEach(star => {
            const x = Math.sin(star.timePassed) * star.orbitRadius;
            const y = Math.cos(star.timePassed) * star.orbitRadius;
            
            // 隨著放大，星星變得更亮
            const enhancedAlpha = Math.min(1, star.alpha * (1 + hyperspaceProgress * 3));
            ctx.globalAlpha = enhancedAlpha;
            
            ctx.drawImage(star.starTexture, 
                         x - star.radius / 2, 
                         y - star.radius / 2, 
                         star.radius * (1 + hyperspaceProgress), 
                         star.radius * (1 + hyperspaceProgress));
            
            star.timePassed += star.speed * (1 + hyperspaceProgress); // 加速旋轉
        });
        ctx.globalCompositeOperation = 'source-over';
        
        // 銀河系中心最亮的白色星核 - 逐漸占滿畫面
        const coreSize = 200 * (1 + hyperspaceProgress * 10); // 中心核心快速放大
        const coreIntensity = Math.min(1, hyperspaceProgress * 2);
        
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
        
        // 創建更強烈的白色核心效果
        if (hyperspaceProgress < 0.7) {
            // 前70%時間：彩色到白色過渡
            coreGradient.addColorStop(0, `hsla(55, 100%, 98%, ${coreIntensity})`);
            coreGradient.addColorStop(0.1, `hsla(50, 95%, 95%, ${coreIntensity * 0.9})`);
            coreGradient.addColorStop(0.2, `hsla(260, 70%, 85%, ${coreIntensity * 0.8})`);
            coreGradient.addColorStop(0.4, `hsla(250, 75%, 75%, ${coreIntensity * 0.7})`);
            coreGradient.addColorStop(0.6, `hsla(240, 70%, 65%, ${coreIntensity * 0.6})`);
            coreGradient.addColorStop(0.8, `hsla(230, 65%, 55%, ${coreIntensity * 0.5})`);
            coreGradient.addColorStop(1, 'transparent');
        } else {
            // 後30%時間：純白光占滿畫面
            const whiteIntensity = Math.min(1, (hyperspaceProgress - 0.7) / 0.3 * 2);
            coreGradient.addColorStop(0, `rgba(255, 255, 255, ${whiteIntensity})`);
            coreGradient.addColorStop(0.2, `rgba(255, 255, 255, ${whiteIntensity * 0.9})`);
            coreGradient.addColorStop(0.4, `rgba(255, 255, 255, ${whiteIntensity * 0.8})`);
            coreGradient.addColorStop(0.6, `rgba(255, 255, 255, ${whiteIntensity * 0.6})`);
            coreGradient.addColorStop(0.8, `rgba(255, 255, 255, ${whiteIntensity * 0.4})`);
            coreGradient.addColorStop(1, 'transparent');
        }
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, coreSize, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
        
        // 在最後階段添加全螢幕白光效果
        if (hyperspaceProgress > 0.85) {
            const finalWhiteIntensity = (hyperspaceProgress - 0.85) / 0.15;
            ctx.fillStyle = `rgba(255, 255, 255, ${finalWhiteIntensity * 0.8})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 檢查是否完成星際穿梭並跳轉頁面
        if (hyperspaceFrames >= HYPERSPACE_DURATION) {
            // 跳轉到home.html
            window.location.href = 'home.html';
        }
    }
    
    // 繪製科技風格文字
    function drawTechText(text, x, y, alpha, scale, lineIndex) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // 文字樣式設定
        const fontSize = 36;
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 計算文字尺寸
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        
        // 科技風格背景框
        const padding = 20;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = textHeight + padding;
        
        // 動態光暈效果
        const time = Date.now() * 0.003;
        const glowIntensity = 0.5 + 0.3 * Math.sin(time + lineIndex);
        
        // 背景框 - 半透明深色
        ctx.fillStyle = `rgba(0, 20, 40, ${alpha * 0.8})`;
        ctx.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
        
        // 邊框 - 科技藍光
        ctx.strokeStyle = `rgba(0, 150, 255, ${alpha * glowIntensity})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
        
        // 內部光暈
        ctx.shadowColor = `rgba(0, 150, 255, ${alpha * 0.6})`;
        ctx.shadowBlur = 15;
        ctx.strokeRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
        ctx.shadowBlur = 0;
        
        // 角落裝飾線
        const cornerSize = 15;
        ctx.strokeStyle = `rgba(0, 255, 150, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        
        // 左上角
        ctx.beginPath();
        ctx.moveTo(-boxWidth/2, -boxHeight/2 + cornerSize);
        ctx.lineTo(-boxWidth/2, -boxHeight/2);
        ctx.lineTo(-boxWidth/2 + cornerSize, -boxHeight/2);
        ctx.stroke();
        
        // 右上角
        ctx.beginPath();
        ctx.moveTo(boxWidth/2 - cornerSize, -boxHeight/2);
        ctx.lineTo(boxWidth/2, -boxHeight/2);
        ctx.lineTo(boxWidth/2, -boxHeight/2 + cornerSize);
        ctx.stroke();
        
        // 左下角
        ctx.beginPath();
        ctx.moveTo(-boxWidth/2, boxHeight/2 - cornerSize);
        ctx.lineTo(-boxWidth/2, boxHeight/2);
        ctx.lineTo(-boxWidth/2 + cornerSize, boxHeight/2);
        ctx.stroke();
        
        // 右下角
        ctx.beginPath();
        ctx.moveTo(boxWidth/2 - cornerSize, boxHeight/2);
        ctx.lineTo(boxWidth/2, boxHeight/2);
        ctx.lineTo(boxWidth/2, boxHeight/2 - cornerSize);
        ctx.stroke();
        
        // 主文字 - 白色帶光暈
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.fillText(text, 0, 0);
        
        // 文字裝飾效果 - 淡藍色覆蓋
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(100, 200, 255, ${alpha * 0.3})`;
        ctx.fillText(text, 0, 0);
        
        // 掃描線效果
        const scanlineY = (time * 50 + lineIndex * 30) % boxHeight - boxHeight/2;
        if (scanlineY > -boxHeight/2 && scanlineY < boxHeight/2) {
            const scanlineGradient = ctx.createLinearGradient(-boxWidth/2, scanlineY - 2, -boxWidth/2, scanlineY + 2);
            scanlineGradient.addColorStop(0, 'transparent');
            scanlineGradient.addColorStop(0.5, `rgba(0, 255, 150, ${alpha * 0.5})`);
            scanlineGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = scanlineGradient;
            ctx.fillRect(-boxWidth/2, scanlineY - 2, boxWidth, 4);
        }
        
        ctx.restore();
    }
    
    function draw(){
        // 統一的深空背景顏色
        const galaxyHue = 217;
        ctx.fillStyle = `hsla(${galaxyHue}, 64%, 3%, 1)`;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        if(phase==='meteors'){
            // 先更新和绘制火花（在陨石后方）
            updateAndDrawSparkles();
            
            // 然后绘制陨石（在火花前方）
            meteors.forEach(m => {
                drawMeteor(m);
                m.x += m.dx;
                m.y += m.dy;
            });
            
            frame++; // 增加幀計數器用於動畫效果
            const d=Math.hypot(meteors[0].x-meteors[1].x,meteors[0].y-meteors[1].y);
            // 精确的碰撞检测：陨石半径是50像素，所以两个陨石中心距离100像素时就碰撞了
            const meteorRadius = 50; // 陨石半径 (更新为50)
            const collisionDistance = meteorRadius * 2; // 两个陨石半径之和
            if(d < collisionDistance){phase='explosion';}
        } else if(phase==='explosion'){
            // 只在非白光階段繪製星際穿梭背景（透明度很低）
            if (explosionFrames < 115) {
                stars.forEach(s => {
                    s.pz = s.z;
                    s.z -= 20;
                    const sx = (s.x * canvas.width) / s.z + canvas.width / 2;
                    const sy = (s.y * canvas.height) / s.z + canvas.height / 2;
                    const psx = (s.x * canvas.width) / s.pz + canvas.width / 2;
                    const psy = (s.y * canvas.height) / s.pz + canvas.height / 2;
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; // 非常低的透明度
                    ctx.lineWidth =  1;
                    ctx.beginPath();
                    ctx.moveTo(psx, psy);
                    ctx.lineTo(sx, sy);
                    ctx.stroke();
                    if (s.z < 1) s.z = 5000;
                });
            }

            explosionFrames++;

            // 超級增強的全螢幕爆炸效果
            const fullScreenEffectDuration = 200; // 延長特效持續時間
            if (explosionFrames <= fullScreenEffectDuration) {
                const progress = explosionFrames / fullScreenEffectDuration;
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                
                // 強化白色閃光效果（前5幀）
                if (explosionFrames <= 5) {
                    const flashAlpha = Math.max(0, 1 - (explosionFrames - 1) / 4);
                    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // 多層波浪效果
                const maxRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
                
                // 主要爆炸波
                const mainWaveRadius = progress * maxRadius * 2;
                const mainGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, mainWaveRadius);
                const mainIntensity = Math.max(0, 1 - progress);
                mainGradient.addColorStop(0, `rgba(255, 255, 255, ${mainIntensity * 0.8})`);
                mainGradient.addColorStop(0.2, `rgba(255, 200, 50, ${mainIntensity * 0.7})`);
                mainGradient.addColorStop(0.4, `rgba(255, 100, 0, ${mainIntensity * 0.6})`);
                mainGradient.addColorStop(0.7, `rgba(255, 50, 0, ${mainIntensity * 0.4})`);
                mainGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = mainGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 二次衝擊波（延遲啟動）
                if (progress > 0.3) {
                    const secondaryProgress = (progress - 0.3) / 0.7;
                    const secondaryRadius = secondaryProgress * maxRadius * 1.5;
                    const secondaryGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, secondaryRadius);
                    const secondaryIntensity = Math.max(0, 1 - secondaryProgress);
                    secondaryGradient.addColorStop(0, `rgba(255, 150, 0, ${secondaryIntensity * 0.5})`);
                    secondaryGradient.addColorStop(0.5, `rgba(255, 80, 0, ${secondaryIntensity * 0.3})`);
                    secondaryGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    
                    ctx.fillStyle = secondaryGradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
            
            // 最終白光閃爍效果 (frames 140-150) - 延長持續時間
            if (explosionFrames >= 140 && explosionFrames <= 150) {
                // 在白光期間，讓星際穿梭效果更明顯
                stars.forEach(s => {
                    s.pz = s.z;
                    s.z -= 30; // 加快速度讓效果更明顯
                    const sx = (s.x * canvas.width) / s.z + canvas.width / 2;
                    const sy = (s.y * canvas.height) / s.z + canvas.height / 2;
                    const psx = (s.x * canvas.width) / s.pz + canvas.width / 2;
                    const psy = (s.y * canvas.height) / s.pz + canvas.height / 2;
                    
                    // 在白光下方繪製星星線條
                    const starAlpha = 0.8; // 增加星星可見度
                    ctx.strokeStyle = `rgba(255,255,255,${starAlpha})`;
                    ctx.lineWidth = 2; // 增加線條寬度
                    ctx.beginPath();
                    ctx.moveTo(psx, psy);
                    ctx.lineTo(sx, sy);
                    ctx.stroke();
                    
                    if (s.z < 1) s.z = 5000;
                });
                
                // 白光覆蓋層，逐漸淡出以顯示星際穿梭
                const flashProgress = (explosionFrames - 140) / 10; // 0 to 1 over 10 frames
                const flashAlpha = Math.max(0, 1 - flashProgress); // Start at full white, fade to transparent
                ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            if (explosionFrames > 150) phase='travel'; // 更新結束條件
        } else if(phase==='travel'){
            travelFrames++;
            stars.forEach(s=>{
                s.pz=s.z;
                s.z-=20;
                const sx=(s.x*canvas.width)/(s.z)+canvas.width/2;
                const sy=(s.y*canvas.height)/(s.z)+canvas.height/2;
                const psx=(s.x*canvas.width)/(s.pz)+canvas.width/2;
                const psy=(s.y*canvas.height)/(s.pz)+canvas.height/2;
                ctx.strokeStyle='white';ctx.lineWidth=1;
                ctx.beginPath();ctx.moveTo(psx,psy);ctx.lineTo(sx,sy);ctx.stroke();
                if(s.z<1) s.z=5000;
            });
            if(travelFrames>200) phase='galaxy';
        } else if(phase==='galaxy'){
            galaxyFrames++;
            const galaxyHue = 217;
            
            // 統一的深空背景效果
            ctx.fillStyle = `hsla(${galaxyHue}, 64%, 3%, 1)`; // 更深的背景
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 如果星際穿梭已啟動，優先繪製星際穿梭效果
            if (hyperspaceActive) {
                drawHyperspaceEffect();
                requestAnimationFrame(draw);
                return;
            }
            
            // 添加銀河系縮放效果（不包含旋轉）
            const t = Math.min(1, galaxyFrames / GALAXY_SCALE_DURATION);
            const scale = 0.001 + 0.999 * (1 - Math.pow(1 - t, 3)); // 慢慢放大效果
            
            // 檢查是否到達80%縮放並啟動文字動畫
            if (t >= GALAXY_TEXT_TRIGGER && !textAnimationActive) {
                textAnimationActive = true;
                currentTextLine = 0;
                textAppearFrames = 0;
            }
            
            // 繪製星云背景效果（在星星之前）- 重新設計以匹配圖片
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            
            // 創建更流動的螺旋星云效果
            const maxRadius = Math.min(canvas.width, canvas.height) / 2;
            
            // 主要螺旋星云背景 - 3條螺旋臂
            for (let arm = 0; arm < 3; arm++) {
                const armOffset = arm * (2 * Math.PI / 3);
                
                // 創建連續的螺旋臂星云 - 減少密度以提升性能
                for (let radius = 40; radius < maxRadius; radius += 35) { // 增加間距
                    const spiralAngle = (radius / maxRadius) * 4.5 * Math.PI + armOffset + (galaxyFrames * 0.002);
                    
                    // 創建沿螺旋臂的星云團 - 減少數量
                    for (let offset = 0; offset < 2; offset++) { // 從3減少到2
                        const offsetAngle = spiralAngle + offset * 0.4;
                        const x = Math.cos(offsetAngle) * radius;
                        const y = Math.sin(offsetAngle) * radius;
                        
                        // 根據距離決定星云顏色 - 藍紫色調
                        const distanceRatio = radius / maxRadius;
                        let nebulaHue, nebulaSaturation, nebulaLightness, nebulaSize;
                        
                        if (distanceRatio < 0.2) {
                            nebulaHue = 50; // 中心黃白色
                            nebulaSaturation = 30;
                            nebulaLightness = 85; // 提高亮度
                            nebulaSize = 120;
                        } else if (distanceRatio < 0.4) {
                            nebulaHue = 260; // 藍紫色
                            nebulaSaturation = 60;
                            nebulaLightness = 65;
                            nebulaSize = 100;
                        } else if (distanceRatio < 0.6) {
                            nebulaHue = 240; // 藍紫色
                            nebulaSaturation = 70;
                            nebulaLightness = 55;
                            nebulaSize = 90;
                        } else if (distanceRatio < 0.8) {
                            nebulaHue = 230; // 深藍紫色
                            nebulaSaturation = 75;
                            nebulaLightness = 45;
                            nebulaSize = 80;
                        } else {
                            nebulaHue = 220; // 深藍色
                            nebulaSaturation = 80;
                            nebulaLightness = 40;
                            nebulaSize = 70;
                        }
                        
                        // 繪製更強烈的星云效果
                        const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, nebulaSize);
                        nebulaGradient.addColorStop(0, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness}%, 0.2)`);
                        nebulaGradient.addColorStop(0.3, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness - 5}%, 0.15)`);
                        nebulaGradient.addColorStop(0.6, `hsla(${nebulaHue}, ${nebulaSaturation}%, ${nebulaLightness - 10}%, 0.08)`);
                        nebulaGradient.addColorStop(1, 'transparent');
                        
                        ctx.fillStyle = nebulaGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, nebulaSize, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }
            
            // 繪製銀河系星星（在星云之後，核心之前）
            ctx.globalCompositeOperation = 'lighter';
            galaxyStars.forEach(star => {
                drawGalaxyStar(star);
            });
            ctx.globalCompositeOperation = 'source-over';
            
            // 增強的中心核心 - 更亮更大，藍紫色調
            const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
            coreGradient.addColorStop(0, 'hsla(55, 100%, 98%, 0.9)'); // 更亮的中心
            coreGradient.addColorStop(0.1, 'hsla(50, 95%, 90%, 0.8)'); // 更亮
            coreGradient.addColorStop(0.2, 'hsla(260, 70%, 75%, 0.6)'); // 藍紫色
            coreGradient.addColorStop(0.4, 'hsla(250, 75%, 65%, 0.5)'); // 藍紫色
            coreGradient.addColorStop(0.6, 'hsla(240, 70%, 55%, 0.4)'); // 藍紫色
            coreGradient.addColorStop(0.8, 'hsla(230, 65%, 45%, 0.3)'); // 深藍紫色
            coreGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
            
            // 重置繪製設定
            ctx.globalCompositeOperation = 'source-over';
            
            // 然後繪製星際穿越前景（在銀河系上方）- 緩慢移動
            stars.forEach(s => {
                s.pz = s.z;
                s.z -= 5; // 從20改為5，大幅降低速度讓星星緩慢移動
                const sx = (s.x * canvas.width) / s.z + canvas.width / 2;
                const sy = (s.y * canvas.height) / s.z + canvas.height / 2;
                const psx = (s.x * canvas.width) / s.pz + canvas.width / 2;
                const psy = (s.y * canvas.height) / s.pz + canvas.height / 2;
                
                // // 星際穿梭線條更亮，在前景顯示
                // ctx.strokeStyle = 'rgba(255,255,255,0.6)'; // 稍微降低透明度配合緩慢效果
                // ctx.lineWidth = 1; // 減少線條寬度讓效果更柔和
                ctx.strokeStyle = 'rgba(255,255,255,0.8)'; // 提高透明度讓前景更明顯
                ctx.lineWidth = 2; // 增加線條寬度

                ctx.beginPath();
                ctx.moveTo(psx, psy);
                ctx.lineTo(sx, sy);
                ctx.stroke();
                
                if (s.z < 1) s.z = 5000;
            });
            
            // 繪製神秘文字動畫（在最上層）
            drawMysteriousText();
            
            // 最終重置
            ctx.globalAlpha = 1;
        }
        requestAnimationFrame(draw);
    }
    
    // 開始載入隕石圖片
    loadMeteorImages();
})();
