class SpaceNavigation {
    constructor() {
        this.currentPage = 'main';
        this.sliderContainer = document.getElementById('slider-container');
        this.contentFrame = document.getElementById('content-frame');
        this.navSpaceship = document.querySelector('.nav-spaceship');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.isAnimating = false;
        
        // 頁面位置定義
        this.pagePositions = {
            left: 0,    // 最左側：0%
            main: -33.333,    // 中間：-33.333%
            right: -66.666    // 最右側：-66.666%
        };
        
        // 性能優化：減少重複計算
        this.meteorInterval = null;
        
        // 滾動控制相關變量
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastScrollTop = 0;
        this.scrollSensitivity = 0.3;// 降低滾動敏感度        // Header 控制相關變量
        this.header = document.querySelector('header');
        this.headerTrigger = document.querySelector('.header-trigger');
        this.headerHint = document.querySelector('.header-hint');
        this.headerVisible = true;
        this.headerTimer = null;
        this.headerHeight = 0; // 用於存儲 header 的實際高度
        
        this.init();
    }    init() {
        // 設置初始滑動位置
        this.sliderContainer.style.transform = `translateX(${this.pagePositions.main}%)`;
        
        // 初始化導航條
        this.initNavigationBar();
        
        // 初始化動態 header
        this.initDynamicHeader();
        
        // 初始化導航條閃爍效果
        this.initNavigationFlash();
        
        // 初始化各種功能
        this.bindEvents();
        this.addTouchSupport();
        this.initSpaceEffects();
        
        // 設置初始活動狀態
        this.setActiveSlide('main');
        
        // 立即調整高度
        this.adjustContainerHeight();
        
        // 監聽窗口大小變化
        window.addEventListener('resize', () => {
            this.adjustContainerHeight();
        });
        
        console.log('滑動系統初始化完成');
        console.log('初始 transform:', this.sliderContainer.style.transform);
    }// 動態調整容器高度以適應內容
    adjustContainerHeight() {
        try {
            const iframes = this.sliderContainer.querySelectorAll('iframe');
            const contentArea = document.querySelector('.content-area');
            
            // 計算可用空間
            const viewportHeight = window.innerHeight;
            const headerHeight = this.header ? this.header.offsetHeight : 80;
            const margins = 60; // 減少邊距以給內容更多空間
            
            // 計算最適合的高度 - 大幅增加高度
            let optimalHeight;
            if (viewportHeight >= 900) {
                optimalHeight = Math.max(viewportHeight - margins, 800);
            } else if (viewportHeight >= 700) {
                optimalHeight = Math.max(viewportHeight * 0.9, 700);
            } else {
                optimalHeight = Math.max(viewportHeight * 0.85, 600);
            }
            
            console.log(`計算高度: 視窗=${viewportHeight}px, 最終=${optimalHeight}px`);
            
            // 設置content-area的高度
            if (contentArea) {
                contentArea.style.height = optimalHeight + 'px';
            }
            
            // 設置slider容器高度
            this.sliderContainer.style.height = optimalHeight + 'px';
            
            // 為所有 iframe 設置更大的高度
            iframes.forEach(iframe => {
                iframe.style.height = optimalHeight + 'px';
                iframe.style.minHeight = optimalHeight + 'px';
            });
            
        } catch (error) {
            console.warn('調整高度時發生錯誤:', error);
            // 設置更大的預設高度
            const defaultHeight = Math.max(window.innerHeight * 0.8, 700);
            
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.style.height = defaultHeight + 'px';
            }
            
            this.sliderContainer.style.height = defaultHeight + 'px';
            
            const iframes = this.sliderContainer.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.style.height = defaultHeight + 'px';
                iframe.style.minHeight = defaultHeight + 'px';
            });
        }
    }// 初始化動態 Header
    initDynamicHeader() {
        // 計算 header 的實際高度
        this.headerHeight = this.header.offsetHeight;
        
        // 初始狀態：Header 顯示
        this.header.classList.add('visible');
        this.headerVisible = true;
        
        // 設置初始的 hidden 狀態的 margin-top
        this.updateHeaderHiddenMargin();
        
        // 3秒後自動隱藏 Header
        this.headerTimer = setTimeout(() => {
            this.hideHeader();
        }, 3000);
        
        // 偵測裝置類型
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // 行動裝置：使用觸控事件
            document.addEventListener('touchstart', (e) => {
                if (e.touches[0].clientY <= 70) {
                    this.showHeader();
                }
            });
            
            document.addEventListener('touchmove', (e) => {
                if (e.touches[0].clientY <= 70) {
                    this.showHeader();
                } else if (e.touches[0].clientY > 150 && this.headerVisible) {
                    clearTimeout(this.headerTimer);
                    this.headerTimer = setTimeout(() => {
                        this.hideHeader();
                    }, 2000); // 行動裝置延長隱藏時間
                }
            });
        } else {
            // 桌面裝置：使用滑鼠事件
            document.addEventListener('mousemove', (e) => {
                if (e.clientY <= 50) {
                    this.showHeader();
                } else if (e.clientY > 150 && this.headerVisible) {
                    clearTimeout(this.headerTimer);
                    this.headerTimer = setTimeout(() => {
                        this.hideHeader();
                    }, 1000);
                }
            });
        }
        
        // Header 本身的事件監聽（通用）
        this.header.addEventListener('mouseenter', () => {
            clearTimeout(this.headerTimer);
            this.showHeader();
        });
        
        this.header.addEventListener('mouseleave', () => {
            this.headerTimer = setTimeout(() => {
                this.hideHeader();
            }, 1000);
        });
          // 觸控事件（行動裝置）
        this.header.addEventListener('touchstart', () => {
            clearTimeout(this.headerTimer);
            this.showHeader();
        });
        
        // Header 提示的事件監聽
        if (this.headerHint) {
            this.headerHint.addEventListener('mouseenter', () => {
                this.showHeader();
            });
            
            this.headerHint.addEventListener('click', () => {
                this.showHeader();
            });
            
            // 觸控支援
            this.headerHint.addEventListener('touchstart', () => {
                this.showHeader();
            });
        }
        
        // 監聽窗口大小變化，重新計算高度
        window.addEventListener('resize', () => {
            this.headerHeight = this.header.offsetHeight;
            this.updateHeaderHiddenMargin();
        });
    }
    
    // 更新 header 隱藏狀態的 margin-top
    updateHeaderHiddenMargin() {
        const style = document.createElement('style');
        style.textContent = `
            header.hidden {
                margin-top: -${this.headerHeight}px !important;
            }
        `;
        // 移除舊的樣式
        const oldStyle = document.getElementById('dynamic-header-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        style.id = 'dynamic-header-style';
        document.head.appendChild(style);
    }    // 顯示 Header
    showHeader() {
        if (!this.headerVisible) {
            this.header.classList.remove('hidden');
            this.header.classList.add('visible');
            this.headerVisible = true;
            
            // 自動滾動到頁面頂部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        // 隱藏提示
        if (this.headerHint) {
            this.headerHint.classList.remove('visible');
        }
        clearTimeout(this.headerTimer);
    }
    
    // 隱藏 Header
    hideHeader() {
        if (this.headerVisible) {
            this.header.classList.remove('visible');
            this.header.classList.add('hidden');
            this.headerVisible = false;
        }
        // 顯示提示
        if (this.headerHint) {
            // 延遲顯示提示，讓 header 隱藏動畫完成
            setTimeout(() => {
                this.headerHint.classList.add('visible');
            }, 200);
        }
    }
    
    // 初始化導航條閃爍效果
    initNavigationFlash() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            // 頁面載入後延遲1秒開始閃爍
            setTimeout(() => {
                navigationBar.classList.add('flash');
                
                // 閃爍動畫完成後移除 class
                setTimeout(() => {
                    navigationBar.classList.remove('flash');
                }, 2000); // 與 CSS 動畫時間匹配
            }, 1000);
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
    }    // 核心滑動方法
    navigateToPage(targetPage) {
        if (this.isAnimating || targetPage === this.currentPage) {
            console.log('滑動被阻止：', this.isAnimating ? '正在動畫中' : '已在目標頁面');
            return;
        }
        
        console.log(`開始滑動：${this.currentPage} → ${targetPage}`);
        
        this.isAnimating = true;
        
        // 獲取目標位置
        const targetPosition = this.pagePositions[targetPage];
        
        console.log(`滑動到位置：${targetPosition}%`);
        
        // 執行滑動動畫
        this.sliderContainer.style.transform = `translateX(${targetPosition}%)`;
        
        // 更新當前頁面
        this.currentPage = targetPage;
        
        // 設置活動slide
        this.setActiveSlide(targetPage);
        
        // 更新導航條
        this.updateNavigationBar(targetPage);
        
        // 動畫完成後解鎖
        setTimeout(() => {
            this.isAnimating = false;
            console.log(`滑動完成，當前頁面：${targetPage}`);
        }, 1000); // 與CSS動畫時間一致
    }
    
    // 設置活動slide
    setActiveSlide(targetPage) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        const targetSlide = document.getElementById(`slide-${targetPage}`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }
    }      // 獲取動畫持續時間（考慮用戶偏好設置）
    getAnimationDuration() {
        // 檢查用戶是否設置了減少動畫偏好
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return prefersReducedMotion ? 300 : 1000; // 與新的CSS時間一致
    }
      addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.sliderContainer.addEventListener('touchend', (e) => {
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
    // initScrollSnap() {
    //     let scrollTimeout = null;
    //     let isUserScrolling = false;
        
    //     // 監聽滾動開始
    //     window.addEventListener('scroll', () => {
    //         isUserScrolling = true;
    //         clearTimeout(scrollTimeout);
            
    //         // 延遲執行吸附，給用戶時間查看內容
    //         scrollTimeout = setTimeout(() => {
    //             if (!this.isScrolling) {
    //                 this.performSnap();
    //             }
    //             isUserScrolling = false;
    //         }, 500); // 增加延遲，讓用戶有充分時間查看
    //     }, { passive: true });
    // }
    
    // // 執行吸附邏輯
    // performSnap() {
    //     const currentScrollTop = window.pageYOffset;
    //     const viewportHeight = window.innerHeight;
        
    //     const header = document.querySelector('header');
    //     const navigation = document.querySelector('.navigation-bar');
    //     const content = document.querySelector('.content-area');
        
    //     if (!header || !navigation || !content) return;
        
    //     // 計算各區域的位置和範圍
    //     const headerTop = 0;
    //     const headerBottom = header.offsetHeight;
        
    //     const navTop = header.offsetHeight;
    //     const navBottom = navTop + navigation.offsetHeight;
        
    //     const contentTop = navBottom;
    //     const contentBottom = contentTop + content.offsetHeight;
        
    //     // 當前視窗位置
    //     const scrollCenter = currentScrollTop + viewportHeight / 2;
        
    //     // 判斷應該吸附到哪個區域
    //     let targetScrollTop = null;
        
    //     if (scrollCenter < headerBottom) {
    //         // 靠近頂部，吸附到頁首
    //         targetScrollTop = headerTop;
    //     } else if (scrollCenter < navBottom) {
    //         // 在導航區域，吸附到導航條
    //         targetScrollTop = navTop;
    //     } else if (scrollCenter < contentBottom) {
    //         // 在內容區域
    //         const contentProgress = (scrollCenter - contentTop) / (contentBottom - contentTop);
            
    //         if (contentProgress < 0.3) {
    //             // 在內容區域上方，吸附到內容開始
    //             targetScrollTop = contentTop;
    //         } else if (contentProgress > 0.7) {
    //             // 在內容區域下方，檢查是否能看到底部
    //             const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
    //             if (currentScrollTop >= maxScroll - 50) {
    //                 // 已經接近底部，不執行吸附
    //                 return;
    //             } else {
    //                 // 吸附到內容開始，讓用戶能完整查看
    //                 targetScrollTop = contentTop;
    //             }
    //         } else {
    //             // 在內容區域中間，不執行吸附，讓用戶自由查看
    //             return;
    //         }
    //     }
        
    //     // 執行吸附
    //     if (targetScrollTop !== null && Math.abs(currentScrollTop - targetScrollTop) > 20) {
    //         window.scrollTo({
    //             top: targetScrollTop,
    //             behavior: 'smooth'
    //         });
            
    //         console.log(`吸附到位置: ${targetScrollTop}px`);
    //     }
    // }
    
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