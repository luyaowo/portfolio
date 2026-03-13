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
    title: '新艺术风格',
    tool: 'Midjourney',
    description: '花朵与自然有机风格',
    date: '2026-03-08',
    prompt: 'An elegant girl , surrounded by plants and flowers, pastel colors, flowers all over hair, Art Nouveau --v 5.2',
  },
  {
    src: 'ai-03.jpg',
    title: '花火',
    tool: 'Midjourney',
    description: '如果说你是海上的烟火',
    date: '2026-03-05',
    prompt: 'https://s.mj.run/8fHk7ppQ2-U, A girl standing on the ground, holding small sparkler, cloud, soft light, lively brushwork, low poly, in the style of dreamlike illustrations, photoshop illustration --v 5.2',
  },
  {
    src: 'ai-04.jpg',
    title: ' 猫',
    tool: 'Midjourney',
    description: '一只猫',
    date: '2026-03-05',
    prompt: 'light watercolor, a cute cat lying on a windowsill, bright, white background, few details, dreamy, studio Ghibli --v 5.1',
  },
{
    src: 'ai-05.jpg',
    title: '打坐的悟空',
    tool: 'Midjourney',
    description: '龙珠',
    date: '2026-03-05',
    prompt: 'Goku of little childhood in Dragon Ball, peacefully meditating in a traditional Chinese ink painting style, eyes closed, sitting cross-legged, with hands gracefully forming the Zen Mudra, front view, full body portrait, Zen, simple color scheme, Chinese Ink Painting, traditional Chinese minimalism, minimalist style, front view, full-body portrait, light and wet ink, high quality, 8k --ar 3:4 --niji 5',
  },
{
    src: 'ai-06.jpg',
    title: '猫猫侠',
    tool: 'Midjourney',
    description: '一个正义的猫猫侠',
    date: '2026-03-05',
    prompt: 'https://s.mj.run/E4tLsMoO7Y4 A cute cartoon character wearing a helmet with cat ears, two large eyes wearing a eye mask, confident expression, and wearing a emblem on the chest, wearing an aquamarine-colored cloak over its shoulders, blind box, Pop Mart, Pixar, clay material, 3d, c4d, OC render, RTX on, best --niji 6 --s 250 --ar 3:4',
  },











];
