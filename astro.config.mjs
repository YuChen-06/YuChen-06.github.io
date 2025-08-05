// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  base: '/',
  build: {
    outDir: 'docs', // 将构建输出放到 /docs 以支持 GitHub Pages
  },
  site: 'https://www.yuchen06.xyz', // 用你的自定义域名
});
