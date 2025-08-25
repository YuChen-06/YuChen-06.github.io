import { useEffect, useState } from 'preact/hooks';
import { gsap } from 'gsap';

const PageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let hideTimeout;
    let hasInitialized = false;

    const completeTransition = () => {
      setIsTransitioning(false);
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
    };

    const startTransition = () => {
      if (hasInitialized) return; // 防止重复初始化
      hasInitialized = true;

      // 移除no-js类，表示JavaScript已加载
      document.body.classList.remove('no-js');

      setIsTransitioning(true);
      document.body.classList.add('page-loading');
      document.body.classList.remove('page-loaded');

      // 600毫秒后完成过渡 - 只是为了避免闪屏
      hideTimeout = setTimeout(completeTransition, 600);
    };

    // 监听页面跳转
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.href.startsWith('#') && !link.target && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        try {
          const currentOrigin = window.location.origin;
          const linkUrl = new URL(link.href, window.location.origin);

          // 只对内部链接应用过渡效果
          if (linkUrl.origin === currentOrigin && linkUrl.pathname !== window.location.pathname) {
            // 显示加载动画
            setIsTransitioning(true);

            // 很短的延迟后跳转
            setTimeout(() => {
              window.location.href = link.href;
            }, 100);

            e.preventDefault();
          }
        } catch (error) {
          console.warn('Failed to parse URL:', link.href);
        }
      }
    };

    // 页面加载完成后执行初始化
    const initializeTransition = () => {
      // 确保只执行一次
      if (!hasInitialized) {
        startTransition();
      }
    };

    // 根据页面加载状态决定何时初始化
    if (document.readyState === 'complete') {
      // 页面已完全加载
      initializeTransition();
    } else if (document.readyState === 'interactive') {
      // DOM已加载，但资源可能还在加载
      initializeTransition();
    } else {
      // 页面还在加载中
      document.addEventListener('DOMContentLoaded', initializeTransition);
    }

    // 监听导航栏链接点击
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('DOMContentLoaded', initializeTransition);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  if (!isTransitioning) return null;

  return (
    <div className="page-transition-overlay">
      <div className="transition-content">
        {/* Joguman加载图片 */}
        <div className="joguman-container">
          <img
            src="/joguman2.png"
            alt="Loading..."
            className="joguman-image"
          />
        </div>
      </div>

      <style jsx>{`
        .page-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }

        .transition-content {
          text-align: center;
          position: relative;
        }

        .joguman-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .joguman-image {
          width: 150px;
          height: auto;
          animation: float 2s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
        }



        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @media (max-width: 768px) {
          .loading-spinner {
            width: 80px;
            height: 80px;
          }

          .progress-container {
            width: 250px;
          }

          .progress-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PageTransition;
