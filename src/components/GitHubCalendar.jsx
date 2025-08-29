import { useEffect, useRef } from 'preact/hooks';

const GitHubCalendarComponent = ({ username = "yuchen-06" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadGitHubData = async () => {
      const cacheKey = `github_data_${username}`;
      const cacheTimeKey = `github_data_time_${username}`;
      const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存，确保数据新鲜

      try {
        // 强制刷新：清除旧缓存以获取最新数据
        console.log('Fetching fresh GitHub data...');
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimeKey);

        // 添加时间戳和随机数强制刷新，绕过所有缓存
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last&_t=${timestamp}&_r=${randomId}&_cache_bust=${Date.now()}`;
        
        const response = await fetch(apiUrl, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch GitHub data`);
        }

        const data = await response.json();

        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        console.log('GitHub data cached successfully');

        if (containerRef.current) {
          renderCalendar(data, containerRef.current);
        }
      } catch (error) {
        console.error('Failed to load GitHub data:', error);

        // 尝试使用过期的缓存数据
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData && containerRef.current) {
          console.log('Using expired cached data as fallback');
          const data = JSON.parse(cachedData);
          renderCalendar(data, containerRef.current);
        } else if (containerRef.current) {
          // 显示备用的模拟数据
          console.log('Using simulated data as fallback');
          renderFallbackCalendar(containerRef.current);
        }
      }
    };

    loadGitHubData();
  }, [username]);

  const renderCalendar = (data, container) => {
    const contributions = data.contributions;
    const totalCount = data.total.lastYear;

    // 计算贡献级别 (0-4)
    const maxCount = Math.max(...contributions.map(day => day.count));
    const getLevel = (count) => {
      if (count === 0) return 0;
      if (maxCount <= 4) return count;
      return Math.min(Math.ceil((count / maxCount) * 4), 4);
    };

    // 生成月份标签
    const generateMonthLabels = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();

      // 计算一年前的日期作为起始点
      const startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setDate(startDate.getDate() + 1);

      // 找到第一个周日作为起始点
      const firstSunday = new Date(startDate);
      firstSunday.setDate(startDate.getDate() - startDate.getDay());

      const monthLabels = [];
      let currentMonth = -1;

      // 遍历53周，为每个月的第一周添加标签
      for (let week = 0; week < 53; week++) {
        const weekDate = new Date(firstSunday);
        weekDate.setDate(firstSunday.getDate() + (week * 7));

        if (weekDate <= today) {
          const month = weekDate.getMonth();

          // 如果是新的月份，添加标签
          if (month !== currentMonth) {
            currentMonth = month;
            const monthName = months[month];
            const gridColumn = week + 2; // +2 是因为第一列是周标签
            monthLabels.push(`<span class="month-label" style="grid-column: ${gridColumn}">${monthName}</span>`);
          }
        }
      }

      return monthLabels.join('');
    };

    // 生成周数标签
    const generateWeekLabels = () => {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekdays.map((day, index) =>
        index % 2 === 1 ? `<span class="week-label">${day}</span>` : '<span class="week-label"></span>'
      ).join('');
    };

    // 创建日历容器
    const calendarHTML = `
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${totalCount} contributions in the last year</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${generateMonthLabels()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${generateWeekLabels()}
            </div>
            <div class="github-calendar-grid">
              ${contributions.map(day => {
                const level = getLevel(day.count);
                const date = new Date(day.date).toLocaleDateString('en-US');
                const contributionText = day.count === 0 ? 'No contributions' :
                  day.count === 1 ? '1 contribution' : `${day.count} contributions`;
                return `
                  <div
                    class="github-day level-${level}"
                    title="${contributionText} on ${date}"
                    data-count="${day.count}"
                    data-date="${day.date}"
                  ></div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="github-calendar-legend">
          <span class="legend-text">Less</span>
          <div class="legend-colors">
            <div class="legend-day level-0"></div>
            <div class="legend-day level-1"></div>
            <div class="legend-day level-2"></div>
            <div class="legend-day level-3"></div>
            <div class="legend-day level-4"></div>
          </div>
          <span class="legend-text">More</span>
        </div>
      </div>
    `;

    container.innerHTML = calendarHTML;
  };

  const renderFallbackCalendar = (container) => {
    // 生成模拟的365天数据
    const days = 365;
    const today = new Date();
    const contributions = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 8); // 0-7 随机贡献数
      contributions.push({
        date: date.toISOString().split('T')[0],
        count: count
      });
    }

    const totalCount = contributions.reduce((sum, day) => sum + day.count, 0);
    const maxCount = Math.max(...contributions.map(day => day.count));

    const getLevel = (count) => {
      if (count === 0) return 0;
      return Math.min(Math.ceil((count / maxCount) * 4), 4);
    };

    // 生成月份和周数标签（复用函数）
    const generateMonthLabels = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();

      // 计算一年前的日期作为起始点
      const startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setDate(startDate.getDate() + 1);

      // 找到第一个周日作为起始点
      const firstSunday = new Date(startDate);
      firstSunday.setDate(startDate.getDate() - startDate.getDay());

      const monthLabels = [];
      let currentMonth = -1;

      // 遍历53周，为每个月的第一周添加标签
      for (let week = 0; week < 53; week++) {
        const weekDate = new Date(firstSunday);
        weekDate.setDate(firstSunday.getDate() + (week * 7));

        if (weekDate <= today) {
          const month = weekDate.getMonth();

          // 如果是新的月份，添加标签
          if (month !== currentMonth) {
            currentMonth = month;
            const monthName = months[month];
            const gridColumn = week + 2; // +2 是因为第一列是周标签
            monthLabels.push(`<span class="month-label" style="grid-column: ${gridColumn}">${monthName}</span>`);
          }
        }
      }

      return monthLabels.join('');
    };

    const generateWeekLabels = () => {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekdays.map((day, index) =>
        index % 2 === 1 ? `<span class="week-label">${day}</span>` : '<span class="week-label"></span>'
      ).join('');
    };

    const calendarHTML = `
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${totalCount} contributions in the last year (demo data)</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${generateMonthLabels()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${generateWeekLabels()}
            </div>
            <div class="github-calendar-grid">
              ${contributions.map(day => {
                const level = getLevel(day.count);
                const date = new Date(day.date).toLocaleDateString('en-US');
                const contributionText = day.count === 0 ? 'No contributions' :
                  day.count === 1 ? '1 contribution' : `${day.count} contributions`;
                return `
                  <div
                    class="github-day level-${level}"
                    title="${contributionText} on ${date}"
                    data-count="${day.count}"
                    data-date="${day.date}"
                  ></div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="github-calendar-legend">
          <span class="legend-text">Less</span>
          <div class="legend-colors">
            <div class="legend-day level-0"></div>
            <div class="legend-day level-1"></div>
            <div class="legend-day level-2"></div>
            <div class="legend-day level-3"></div>
            <div class="legend-day level-4"></div>
          </div>
          <span class="legend-text">More</span>
        </div>
      </div>
    `;

    container.innerHTML = calendarHTML;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>正在加载 GitHub 贡献数据...</div>
    </div>
  );
};

export default GitHubCalendarComponent;
