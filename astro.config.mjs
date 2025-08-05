// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // 输出为静态站点
  output: 'static',

  // 如果你使用的是 GitHub Pages 的项目根目录或绑定自定义域名，不需要设 base
  // 但如果部署到子路径（例如 yuchen-06.github.io/Blog/），base 应为 '/Blog/'
  base: '/',

  // 用于生成 sitemap、RSS 等以及链接解析
  site: 'https://www.yuchen06.xyz',

  // 构建输出目录，设置为 docs 是为了配合 GitHub Pages 的发布策略
  outDir: 'docs',

  // 其他配置（根据需要启用）
  markdown: {
    shikiConfig: {
      theme: 'github-dark', // 代码高亮主题
    },
  },

  // 可扩展插件或 Vite 配置
  vite: {
    // 可以添加 alias 或其他配置
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
