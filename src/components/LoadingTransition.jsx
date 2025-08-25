import { useState, useEffect } from 'preact/hooks';

const LoadingTransition = ({
  loadingText = "加载中...",
  animationImage = "/joguman2.png",
  minLoadingTime = 600, // 减少一半加载时间
  children
}) => {
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoading(false);
      }, 500);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  return (
    <>
      {showLoading && (
        <div className={`loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
          <div className="loading-content">
            <div className="loading-animation">
              <img
                src={animationImage}
                alt="Loading"
                className="loading-image"
              />
              <div className="loading-spinner"></div>
            </div>
            <p className="loading-text">{loadingText}</p>
          </div>
        </div>
      )}

      <div className={`page-content ${!showLoading ? 'fade-in' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default LoadingTransition;
