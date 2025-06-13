class SpaceNavigation {
    constructor() {
        this.currentPage = 'main';
        this.slideContainer = document.getElementById('slide-container');
        this.contentFrame = document.getElementById('content-frame');
        this.navSpaceship = document.querySelector('.nav-spaceship');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.isAnimating = false;
        
        // 性能優化：減少重複計算
        this.meteorInterval = null;
        
        // 滾動控制相關變量
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastScrollTop = 0;
        this.scrollSensitivity = 0.3; // 降低滾動敏感度
        
        this.pages = {
            left: 0,    // 第一個slide的位置
            main: 1,    // 第二個slide的位置
            right: 2    // 第三個slide的位置
        };
        
        this.init();
    }
    
    init() {
        // 初始化滑動容器位置 - 默認顯示中間頁面
        this.slideContainer.style.transform = 'translateX(-33.333%)';
        
        // 初始化導航條
        this.initNavigationBar();
        
        // 初始化各種功能
        this.bindEvents();
        this.addTouchSupport();
        this.initSpaceEffects();
        this.initScrollSnap(); // 新增滾動定格功能
        
        // 監聽所有iframe載入完成，調整高度
        const iframes = this.slideContainer.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.addEventListener('load', () => {
                this.adjustContainerHeight();
            });
        });
    }
    
    // 動態調整容器高度以適應內容
    adjustContainerHeight() {
        try {
            const iframes = this.slideContainer.querySelectorAll('iframe');
            
            // 計算可用空間，大幅增加顯示高度
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('header').offsetHeight || 0;
            const navHeight = document.querySelector('.navigation-bar').offsetHeight || 0;
            const margins = 40; // 減少邊距，給內容更多空間
            
            // 計算最適合的高度 - 大幅增加顯示區域
            let optimalHeight;
            if (viewportHeight >= 800) {
                // 大螢幕：使用更大比例，幾乎全螢幕
                optimalHeight = Math.max(viewportHeight - headerHeight - navHeight - margins, 700);
            } else if (viewportHeight >= 600) {
                // 中等螢幕：使用更大比例
                optimalHeight = Math.max(viewportHeight * 0.85, 600);
            } else {
                // 小螢幕：也要確保足夠的顯示空間
                optimalHeight = Math.max(viewportHeight * 0.75, 500);
            }
            
            // 為所有 iframe 設置統一的高度
            iframes.forEach(iframe => {
                iframe.style.height = optimalHeight + 'px';
            });
            
            // 設置容器高度
            this.slideContainer.style.height = optimalHeight + 'px';
            
            console.log(`設置增強高度為: ${optimalHeight}px (視窗高度: ${viewportHeight}px)`);
            
        } catch (error) {
            console.warn('調整高度時發生錯誤:', error);
            // 設置更大的預設高度
            const defaultHeight = Math.max(window.innerHeight * 0.85, 700);
            this.slideContainer.style.height = defaultHeight + 'px';
            
            const iframes = this.slideContainer.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.style.height = defaultHeight + 'px';
            });
        }
    }
    
    // 初始化太空效果
    initSpaceEffects() {
        // 定期創建流星效果
        this.meteorInterval = setInterval(() => {
            this.createMeteor();
        }, 5000 + Math.random() * 10000); // 5-15秒隨機間隔
    }
    
    // 創建流星效果
    createMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // 隨機起始位置
        meteor.style.left = Math.random() * 50 + '%';
        meteor.style.top = Math.random() * 50 + '%';
        
        document.body.appendChild(meteor);
        
        // 觸發動畫
        setTimeout(() => {
            meteor.classList.add('meteor-animation');
        }, 100);
        
        // 清理元素
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.parentNode.removeChild(meteor);
            }
        }, 3500);
    }
    
    // 初始化導航條
    initNavigationBar() {
        // 為每個導航點添加點擊事件
        this.navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetPage = dot.getAttribute('data-page');
                if (targetPage !== this.currentPage && !this.isAnimating) {
                    this.navigateToPage(targetPage);
                }
            });
        });
        
        // 設置初始位置
        this.updateNavigationBar('main');
    }
    
    // 更新導航條狀態
    updateNavigationBar(targetPage) {
        // 更新點的活動狀態
        this.navDots.forEach(dot => {
            const dotPage = dot.getAttribute('data-page');
            if (dotPage === targetPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 移動小飛船到對應位置
        this.navSpaceship.className = `nav-spaceship position-${targetPage}`;
    }
    
    bindEvents() {
        // 鍵盤導航
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            if (this.currentPage === 'main') {
                if (e.key === 'ArrowLeft') this.navigateToPage('left');
                if (e.key === 'ArrowRight') this.navigateToPage('right');
            } else {
                if (e.key === 'Escape' || e.key === 'Backspace') {
                    this.navigateToPage('main');
                }
            }
        });
    }
    
    navigateToPage(targetPage) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        
        // 計算滑動位置
        const targetPosition = this.pages[targetPage];
        const translateX = -targetPosition * 33.333; // 每個頁面佔33.333%
        
        // 執行滑動動畫
        this.slideContainer.style.transform = `translateX(${translateX}%)`;
        
        // 更新當前頁面
        this.currentPage = targetPage;
        
        // 更新導航條
        this.updateNavigationBar(targetPage);
        
        // 動畫完成後解除鎖定
        setTimeout(() => {
            this.isAnimating = false;
            this.adjustContainerHeight();
        }, 600); // 與CSS transition時間一致
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.slideContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.slideContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY || this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            
            // 判斷是否為有效的滑動手勢
            if (Math.abs(deltaX) > Math.abs(deltaY) && 
                Math.abs(deltaX) > 50 && 
                deltaTime < 300) {
                
                if (this.currentPage === 'main') {
                    if (deltaX > 0) {
                        // 向左滑動，顯示右頁面
                        this.navigateToPage('right');
                    } else {
                        // 向右滑動，顯示左頁面
                        this.navigateToPage('left');
                    }
                } else {
                    // 在非主頁面時，滑動返回主頁
                    this.navigateToPage('main');
                }
            }
            
            startX = 0;
            startY = 0;
            startTime = 0;
        }, { passive: true });
    }
    
    // 初始化滾動定格功能
    initScrollSnap() {
        let scrollTimeout = null;
        let isUserScrolling = false;
        
        // 監聽滾動開始
        window.addEventListener('scroll', () => {
            isUserScrolling = true;
            clearTimeout(scrollTimeout);
            
            // 延遲執行吸附，給用戶時間查看內容
            scrollTimeout = setTimeout(() => {
                if (!this.isScrolling) {
                    this.performSnap();
                }
                isUserScrolling = false;
            }, 500); // 增加延遲，讓用戶有充分時間查看
        }, { passive: true });
    }
    
    // 執行吸附邏輯
    performSnap() {
        const currentScrollTop = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        const header = document.querySelector('header');
        const navigation = document.querySelector('.navigation-bar');
        const content = document.querySelector('.content-area');
        
        if (!header || !navigation || !content) return;
        
        // 計算各區域的位置和範圍
        const headerTop = 0;
        const headerBottom = header.offsetHeight;
        
        const navTop = header.offsetHeight;
        const navBottom = navTop + navigation.offsetHeight;
        
        const contentTop = navBottom;
        const contentBottom = contentTop + content.offsetHeight;
        
        // 當前視窗位置
        const scrollCenter = currentScrollTop + viewportHeight / 2;
        
        // 判斷應該吸附到哪個區域
        let targetScrollTop = null;
        
        if (scrollCenter < headerBottom) {
            // 靠近頂部，吸附到頁首
            targetScrollTop = headerTop;
        } else if (scrollCenter < navBottom) {
            // 在導航區域，吸附到導航條
            targetScrollTop = navTop;
        } else if (scrollCenter < contentBottom) {
            // 在內容區域
            const contentProgress = (scrollCenter - contentTop) / (contentBottom - contentTop);
            
            if (contentProgress < 0.3) {
                // 在內容區域上方，吸附到內容開始
                targetScrollTop = contentTop;
            } else if (contentProgress > 0.7) {
                // 在內容區域下方，檢查是否能看到底部
                const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
                if (currentScrollTop >= maxScroll - 50) {
                    // 已經接近底部，不執行吸附
                    return;
                } else {
                    // 吸附到內容開始，讓用戶能完整查看
                    targetScrollTop = contentTop;
                }
            } else {
                // 在內容區域中間，不執行吸附，讓用戶自由查看
                return;
            }
        }
        
        // 執行吸附
        if (targetScrollTop !== null && Math.abs(currentScrollTop - targetScrollTop) > 20) {
            window.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
            
            console.log(`吸附到位置: ${targetScrollTop}px`);
        }
    }
    
    // 處理滾動事件
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(currentScrollTop - this.lastScrollTop) < 3) {
            return;
        }
        
        this.lastScrollTop = currentScrollTop;
        this.isScrolling = true;
        
        clearTimeout(this.scrollTimeout);
        
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 100);
    }
    
    // 清理資源
    destroy() {
        if (this.meteorInterval) {
            clearInterval(this.meteorInterval);
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.spaceNavigation = new SpaceNavigation();
});

// 頁面卸載時清理資源
window.addEventListener('beforeunload', () => {
    if (window.spaceNavigation) {
        window.spaceNavigation.destroy();
    }
});