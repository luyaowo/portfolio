import sharpService from 'astro/assets/services/sharp';

const isGif = (options) =>
  typeof options.src === 'object' && options.src?.format === 'gif';

export default {
  ...sharpService,
  validateOptions(options, config) {
    // Preserve GIF animation without decoding every frame during the build.
    if (isGif(options)) options.format = 'gif';
    return sharpService.validateOptions(options, config);
  },
  getSrcSet(options, config) {
    return isGif(options) ? [] : sharpService.getSrcSet(options, config);
  },
  async transform(inputBuffer, options, config) {
    const signature = new TextDecoder().decode(inputBuffer.subarray(0, 6));
    if (options.format === 'gif' && /^(GIF87a|GIF89a)$/.test(signature)) {
      return { data: inputBuffer, format: 'gif' };
    }
    return sharpService.transform(inputBuffer, options, config);
  },
};
