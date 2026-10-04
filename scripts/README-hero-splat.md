# Hero splat generation

`public/models/hero.splat` (65,536 Gaussians, ~2 MB) and
`public/models/hero-131k.splat` (131,072 Gaussians, ~4 MB) are generated from
`src/assets/images/alex/alex-sitting-in-gras-with-camera.png` with
[TripoSplat](https://github.com/VAST-AI-Research/TripoSplat) (MIT).

## Setup

- Machine: Windows desktop, RTX 5090 (32 GB), driver 591.59
- Python 3.11 venv, PyTorch 2.11.0+cu128, plus `numpy safetensors pillow tqdm huggingface_hub`
- TripoSplat commit: `d8db9e018b413dd9c4a9fe22463781bf98e8e68d`
- Weights (~4.2 GB): `hf download VAST-AI/TripoSplat --local-dir ckpts`

## Generation

1. Crop the source photo to the box `(left, top, right, bottom) = (250, 80, 680, 552)`.
2. Run the pipeline from the repo root (background removal via the bundled BiRefNet):

```python
from PIL import Image
from triposplat import TripoSplatPipeline

Image.open("hero.png").convert("RGB").crop((250, 80, 680, 552)).save("hero_crop.png")
pipe = TripoSplatPipeline(
    ckpt_path="ckpts/diffusion_models/triposplat_fp16.safetensors",
    decoder_path="ckpts/vae/triposplat_vae_decoder_fp16.safetensors",
    dinov3_path="ckpts/clip_vision/dino_v3_vit_h.safetensors",
    flux2_vae_encoder_path="ckpts/vae/flux2-vae.safetensors",
    rmbg_path="ckpts/background_removal/birefnet.safetensors",
    device="cuda",
)
counts = [65536, 131072]
gs, _ = pipe.run("hero_crop.png", seed=42, steps=20, guidance_scale=3.0, num_gaussians=counts)
for n, g in zip(counts, gs):
    g.save_splat(f"hero_{n}.splat")
```

3. Copy `hero_65536.splat` to `public/models/hero.splat` and `hero_131072.splat`
   to `public/models/hero-131k.splat`.

Generation takes about 10 seconds. Seed 42, 20 steps and guidance scale 3.0 are
the TripoSplat defaults; the same seed gives the same output.
