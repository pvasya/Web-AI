// https://huggingface.co/Xenova/moondream2

import { AutoProcessor, AutoTokenizer, Moondream1ForConditionalGeneration, RawImage } from '@huggingface/transformers';

const modelId = 'Xenova/moondream2';

let processor, tokenizer, model;

async function initModel() {
  if (model) return;
  processor = await AutoProcessor.from_pretrained(modelId);
  tokenizer = await AutoTokenizer.from_pretrained(modelId);
  model = await Moondream1ForConditionalGeneration.from_pretrained(modelId, {
    dtype: {
      embed_tokens: 'fp16',
      vision_encoder: 'fp16',
      decoder_model_merged: 'q4',
    },
    device: navigator.gpu ? 'webgpu' : 'wasm',
  });
  postMessage({ type: 'ready' });
}

self.onmessage = async (e) => {
  const { type, text, imageUrl } = e.data;

  if (type === 'init') {
    await initModel();
    return;
  }

  if (type === 'delete') {
    const cache = await caches.open('transformers-cache');
    const keys = await cache.keys();
    keys.forEach(request => cache.delete(request));
    self.postMessage({
        type: 'delete_success',
        message: 'Cache cleared successfully.'
    });
    return;
  }

  if (type === 'analyse') {
    await initModel();

    const prompt = `<image>\n\nQuestion: ${text}\n\nAnswer:`;
    const textInputs = tokenizer(prompt);

    const rawImage = await RawImage.fromURL(imageUrl);
    const visionInputs = await processor(rawImage);

    const outputIds = await model.generate({
      ...textInputs,
      ...visionInputs,
      do_sample: false,
      max_new_tokens: 64
    });

    const decoded = tokenizer.batch_decode(outputIds, { skip_special_tokens: false });

    let result = decoded[0].replace('<|endoftext|>\n\n', '')
                           .replace('<|endoftext|>', '')
                           .replace('<|endoftext|>', '')
                           .replace('<image>\n\n', '');
    

    postMessage({ type: 'result', answer: result });
  }
};

