// https://huggingface.co/Xenova/moondream2
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { AutoProcessor, AutoTokenizer, Moondream1ForConditionalGeneration, RawImage } from '@huggingface/transformers';

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

let processor, tokenizer, model;

async function initModel() {
  if (model) return;

  const modelId = 'Xenova/moondream2';
  console.log('Loading the Moondream2 model...');
  processor = await AutoProcessor.from_pretrained(modelId);
  tokenizer = await AutoTokenizer.from_pretrained(modelId);
  model = await Moondream1ForConditionalGeneration.from_pretrained(modelId, {
    dtype: {
      embed_tokens: 'fp16',
      vision_encoder: 'fp16',
      decoder_model_merged: 'q4',
    },
    device: 'cuda' // dml cuda gpu
  });
  console.log('Moondream2 model loaded');
}

initModel();

app.post('/moondream', upload.single('image'), async (req, res) => {
  try {
    initModel();
    const text = req.body.text;
    if (!text) {
      return res.status(400).json({ error: 'Missing text field' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Missing image file' });
    }

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    const start = performance.now();

    const rawImage = await RawImage.fromBlob(blob);


    const prompt = `<image>\n\nQuestion: ${text}\n\nAnswer:`;
    const textInputs = tokenizer(prompt);
    const visionInputs = await processor(rawImage);

    const output  = await model.generate({
      ...textInputs,
      ...visionInputs,
      do_sample: false,
      max_new_tokens: 64,
    });

    const decoded = tokenizer.batch_decode(output , { skip_special_tokens: false });

    const end = performance.now();

    const answer = decoded[0]
      .replace('<|endoftext|>\n\n', '')
      .replace('<|endoftext|>', '')
      .replace('<|endoftext|>', '')
      .replace('<image>\n\n', '');

    res.json({ answer });

    console.log(answer);  
    console.log(`Moondream2 time: ${end - start} ms`);

  } catch (err) {
    console.error('Error in /moondream:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server listening port ${port}`);
});
