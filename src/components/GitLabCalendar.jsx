import { useEffect, useRef } from 'preact/hooks';

const GitLabCalendar = ({
  username = process.env.GITLAB_USERNAME || "Chen",
  gitlabUrl = process.env.GITLAB_URL || "https://git.henau.edu.cn",
  accessToken = process.env.GITLAB_ACCESS_TOKEN || "" // Personal Access Token - 从环境变量获取
}) => {
  // 调试环境变量
  console.log('Environment variables:', {
    GITLAB_ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN ? 'SET' : 'NOT SET',
    GITLAB_URL: process.env.GITLAB_URL,
    GITLAB_USERNAME: process.env.GITLAB_USERNAME
  });
  const containerRef = useRef(null);

  const loadGitLabData = async () => {
    const cacheKey = `gitlab_data_${username}`;
    const cacheTimeKey = `gitlab_data_time_${username}`;
    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存，确保数据新鲜
    
    try {
      // 强制刷新：清除旧缓存以获取最新数据
      console.log('Fetching fresh GitLab data...');
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cacheTimeKey);

      // 设置认证头
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (accessToken) {
        headers['PRIVATE-TOKEN'] = accessToken;
        console.log('Using Personal Access Token for GitLab API');
      } else {
        console.log('No access token provided, trying public API');
      }

      const fetchOptions = {
        headers,
        mode: 'cors',
        credentials: 'omit'
      };

      // 获取用户ID
      console.log('Fetching GitLab user info...');
      const userApiUrl = `${gitlabUrl}/api/v4/users?username=${username}`;
      const userResponse = await fetch(userApiUrl, fetchOptions);

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userResponse.status} ${userResponse.statusText}`);
      }

      const users = await userResponse.json();
      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      const userId = users[0].id;
      console.log(`Found GitLab user ID: ${userId}`);

      // 获取用户事件数据
      console.log('Fetching GitLab events...');
      const eventsApiUrl = `${gitlabUrl}/api/v4/users/${userId}/events`;
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // 添加时间戳和随机数强制刷新，绕过所有缓存
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);

      let allEvents = [];
      let page = 1;
      const perPage = 100;

      // 获取多页数据
      while (page <= 10) { // 增加到10页获取更多数据
        const eventsUrl = `${eventsApiUrl}?after=${oneYearAgo.toISOString()}&per_page=${perPage}&page=${page}&_t=${timestamp}&_r=${randomId}&_cache_bust=${Date.now()}`;
        console.log(`Fetching fresh page ${page}...`);

        const eventsResponse = await fetch(eventsUrl, fetchOptions);

        if (!eventsResponse.ok) {
          if (page === 1) {
            throw new Error(`Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`);
          } else {
            console.log(`Page ${page} failed, stopping pagination`);
            break;
          }
        }

        const pageEvents = await eventsResponse.json();
        if (!pageEvents || pageEvents.length === 0) {
          console.log(`Page ${page} returned no events, stopping pagination`);
          break;
        }

        allEvents = allEvents.concat(pageEvents);
        console.log(`Page ${page}: ${pageEvents.length} events`);
        page++;

        // 如果返回的数据少于perPage，说明已经是最后一页
        if (pageEvents.length < perPage) {
          console.log('Reached last page');
          break;
        }

        // 添加小延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Total events fetched: ${allEvents.length}`);

      // 处理数据生成贡献图数据
      const contributionData = processEventsToContributions(allEvents);

      // 缓存数据
      localStorage.setItem(cacheKey, JSON.stringify(contributionData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      console.log('GitLab data cached successfully');

      if (containerRef.current) {
        renderCalendar(contributionData, containerRef.current);
      }
    } catch (error) {
      console.error('GitLab API access failed:', error.message);

      // 尝试使用过期的缓存数据
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData && containerRef.current) {
        console.log('Using cached GitLab data as fallback');
        const data = JSON.parse(cachedData);
        renderCalendar(data, containerRef.current);
      } else if (containerRef.current) {
        // 显示简洁的提示信息
        renderUnavailableMessage(containerRef.current);
      }
    }
  };

  useEffect(() => {
    loadGitLabData();
  }, [username, gitlabUrl, accessToken]);

  // 处理事件数据，转换为贡献图格式
  const processEventsToContributions = (events) => {
    const contributionMap = new Map();
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // 初始化过去365天的数据
    for (let i = 0; i < 365; i++) {
      const date = new Date(oneYearAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      contributionMap.set(dateStr, 0);
    }

    // 统计每天的贡献次数
    events.forEach(event => {
      const eventDate = new Date(event.created_at);
      const dateStr = eventDate.toISOString().split('T')[0];

      // 只统计有意义的贡献事件
      const contributionActions = [
        'pushed', 'opened', 'closed', 'merged', 'commented', 'created', 'updated', 'approved'
      ];

      if (event.action_name && contributionActions.some(action => 
        event.action_name.toLowerCase().includes(action.toLowerCase())
      )) {
        const currentCount = contributionMap.get(dateStr) || 0;
        contributionMap.set(dateStr, currentCount + 1);
      }
    });

    // 转换为数组格式
    const contributions = [];
    const totalCount = Array.from(contributionMap.values()).reduce((sum, count) => sum + count, 0);

    contributionMap.forEach((count, date) => {
      contributions.push({
        date,
        count,
        level: getContributionLevel(count, contributionMap)
      });
    });

    return {
      contributions: contributions.sort((a, b) => new Date(a.date) - new Date(b.date)),
      total: {
        lastYear: totalCount
      }
    };
  };

  // 计算贡献级别 (0-4)
  const getContributionLevel = (count, contributionMap) => {
    if (count === 0) return 0;

    const allCounts = Array.from(contributionMap.values()).filter(c => c > 0);
    if (allCounts.length === 0) return 0;

    const maxCount = Math.max(...allCounts);
    const quartile = maxCount / 4;

    if (count <= quartile) return 1;
    if (count <= quartile * 2) return 2;
    if (count <= quartile * 3) return 3;
    return 4;
  };

  // 渲染日历
  const renderCalendar = (data, container) => {
    const contributions = data.contributions;
    const totalCount = data.total.lastYear;

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
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>${totalCount} contributions in the last year</span>
        </div>
        <div class="gitlab-calendar-wrapper">
          <div class="gitlab-calendar-months">
            ${generateMonthLabels()}
          </div>
          <div class="gitlab-calendar-content">
            <div class="gitlab-calendar-weeks">
              ${generateWeekLabels()}
            </div>
            <div class="gitlab-calendar-grid">
              ${contributions.map(day => {
      const date = new Date(day.date).toLocaleDateString('en-US');
      const contributionText = day.count === 0 ? 'No contributions' :
        day.count === 1 ? '1 contribution' : `${day.count} contributions`;
      return `
                  <div
                    class="gitlab-day level-${day.level}"
                    title="${contributionText} on ${date}"
                    data-count="${day.count}"
                    data-date="${day.date}"
                  ></div>
                `;
    }).join('')}
            </div>
          </div>
        </div>
        <div class="gitlab-calendar-legend">
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


  // 渲染简洁的不可用提示
  const renderUnavailableMessage = (container) => {
    const messageHTML = `
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>GitLab data unavailable (local deployment)</span>
        </div>
        <div class="gitlab-unavailable-message">
          <p>🔒 School GitLab requires campus network access</p>
        </div>
      </div>
    `;

    container.innerHTML = messageHTML;
  };

  return <div ref={containerRef} className="gitlab-calendar-container" />;
};

export default GitLabCalendar;
