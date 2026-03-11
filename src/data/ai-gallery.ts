export interface AIImage {
  /** 文件名（对应 src/assets/ai/ 下的图片） */
  src: string;
  /** 作品标题 */
  title: string;
  /** 使用的生成工具，如 Midjourney、Stable Diffusion、DALL·E 等 */
  tool: string;
  /** 简短描述 */
  description?: string;
  /** 生成日期 YYYY-MM-DD */
  date?: string;
  /** 完整的 Prompt */
  prompt?: string;
}

/**
 * AI 生成图像列表
 * 添加新图片时，将图片放入 src/assets/ai/ 目录，然后在此数组中添加一条记录。
 */
export const aiGallery: AIImage[] = [
  {
    src: 'ai-01.jpg',
    title: 'IP',
    tool: 'Midjourney',
    description: '泡泡玛特风格',
    date: '2026-03-10',
    prompt: 'a little girl, with a hoodie and a jacket, cat ears, looking at viewer, full body, in the style of futuristic cyberpunk, simple background, Pixar, Graffiti color, candy colors, chibi, pop mart, fashion trends, street style, 3d, c4d, OC render, RTX on, best quality, 8k --niji 5 --ar 3:4 ',
  },
  {
    src: 'ai-02.jpg',
    title: '机械花卉',
    tool: 'DALL·E',
    description: '机械与自然的边界探索',
    date: '2026-03-08',
    prompt: 'A delicate flower made of brass and copper gears, with pistons and springs as petals, photorealistic, warm golden hour lighting, intricate mechanical details, steampunk style, soft focus background',
  },
  {
    src: 'ai-03.jpg',
    title: '虚实之间',
    tool: 'Stable Diffusion',
    description: '超现实主义空间实验',
    date: '2026-03-05',
    prompt: 'An impossible architectural space where floating islands connect through cascading waterfalls, surrealism, dreamlike atmosphere, pastel color palette, floating geometric shapes, studio ghibli inspired, masterpiece',
  },
];
