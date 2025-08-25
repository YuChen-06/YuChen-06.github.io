import { useState, useEffect } from 'preact/hooks';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // 计算滚动进度
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      
      // 显示进度条（当有滚动时）
      if (progress > 0) {
        setIsVisible(true);
        setIsScrolling(true);
        
        // 清除之前的定时器
        clearTimeout(scrollTimeout);
        
        // 停止滚动后延迟隐藏进度条
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
          // 再延迟一点完全隐藏，让淡出动画完成
          setTimeout(() => {
            if (!isScrolling) {
              setIsVisible(false);
            }
          }, 300);
        }, 1500); // 停止滚动1.5秒后开始隐藏
      } else {
        // 在页面顶部时立即隐藏
        setIsVisible(false);
        setIsScrolling(false);
      }
    };

    // 添加滚动监听器
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始检查
    handleScroll();

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);

  return (
    <div 
      className={`scroll-progress-container ${isVisible ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        zIndex: 1000,
        opacity: isVisible && isScrolling ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div 
        className="scroll-progress-bar"
        style={{
          height: '100%',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #66b3ff 0%, #0066cc 50%, #004499 100%)',
          transition: 'width 0.1s ease-out',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 10px rgba(102, 179, 255, 0.5)',
        }}
      />
    </div>
  );
};

export default ScrollProgress;
