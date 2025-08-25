# GitLab 真实数据配置指南

## 🎯 概述

本项目支持显示真实的GitLab贡献数据，但学校本地部署的GitLab需要特殊配置。

## 🔍 学校GitLab的访问限制

### 常见限制：
1. **网络隔离**：只能在校园网内访问
2. **CORS限制**：浏览器跨域访问被阻止
3. **认证要求**：需要登录session或access token
4. **API权限**：可能需要特定权限

## 🚀 解决方案

### 方案1：获取Personal Access Token（推荐）

1. **登录GitLab**：在校园网环境下访问 `https://git.henau.edu.cn`

2. **创建Access Token**：
   - 点击右上角头像 → Settings
   - 左侧菜单选择 "Access Tokens"
   - 创建新token，权限选择：
     - `read_user` - 读取用户信息
     - `read_api` - 读取API数据

3. **配置Token**：
   ```jsx
   <GitLabCalendar 
     username="Chen"
     gitlabUrl="https://git.henau.edu.cn"
     accessToken="your-access-token-here"
     fallbackToDemo={false}
   />
   ```

### 方案2：校园网环境部署

如果你的博客部署在校园网内：
- 直接访问GitLab API无需额外配置
- 确保服务器可以访问GitLab实例

### 方案3：代理服务器

创建一个代理服务器来转发GitLab API请求：

```javascript
// proxy-server.js (Node.js)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/gitlab-api', createProxyMiddleware({
  target: 'https://git.henau.edu.cn',
  changeOrigin: true,
  pathRewrite: {
    '^/gitlab-api': '/api/v4'
  },
  headers: {
    'PRIVATE-TOKEN': 'your-access-token'
  }
}));

app.listen(3001);
```

## 🎨 当前实现特性

### 智能降级机制：
1. **优先尝试**：真实GitLab API
2. **缓存降级**：使用24小时缓存数据
3. **演示降级**：显示模拟的贡献数据
4. **简洁提示**：显示不可用信息

### 演示数据特点：
- 模拟真实的开发模式
- 工作日更多贡献（70%概率）
- 周末较少贡献（30%概率）
- 符合实际开发习惯

## 🔧 配置参数

```jsx
<GitLabCalendar 
  username="Chen"                    // GitLab用户名
  gitlabUrl="https://git.henau.edu.cn"  // GitLab实例URL
  accessToken={null}                 // 访问令牌（可选）
  fallbackToDemo={true}              // 失败时是否显示演示数据
/>
```

## 📊 支持的贡献类型

- **代码推送** (pushed)
- **问题开启/关闭** (opened/closed)
- **合并请求** (merged)
- **评论** (commented on)
- **创建操作** (created)

## 🛠️ 故障排除

### 常见问题：

1. **CORS错误**：
   - 浏览器控制台显示跨域错误
   - 解决：使用access token或代理服务器

2. **401 Unauthorized**：
   - API返回未授权错误
   - 解决：检查access token权限

3. **404 Not Found**：
   - 用户名不存在或API路径错误
   - 解决：确认用户名和GitLab URL

4. **网络超时**：
   - 校园网外无法访问
   - 解决：在校园网环境下测试

## 💡 建议

对于学校GitLab，推荐配置：
- 启用演示数据降级 (`fallbackToDemo={true}`)
- 在校园网环境下获取并缓存真实数据
- 定期手动更新缓存数据

这样既能展示贡献图，又不会因为网络限制影响用户体验。
