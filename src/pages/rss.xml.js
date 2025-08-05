import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await import.meta.glob('./posts/*.md', { eager: true });
  
  const items = Object.values(posts).map((post) => ({
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
    description: post.frontmatter.description,
    link: post.url,
    author: post.frontmatter.author,
  }));

  return rss({
    title: '我的 Astro 博客',
    description: '我学习 Astro 的旅程',
    site: context.site,
    items: items,
    customData: `<language>zh-cn</language>`,
  });
}
