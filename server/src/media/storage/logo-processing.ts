import sharp from 'sharp';

// Uploaded company/employer logos vary wildly in how much blank canvas
// surrounds the actual mark — some are cropped tight, others ship with a
// lot of padding baked into the file. Rendered at a fixed tile size with
// object-cover, that inconsistency reads as "some logos are bigger than
// others" even though every tile is pixel-identical. Trimming to the
// mark's bounding box and re-padding to a fixed ratio makes every logo
// occupy the same proportion of its tile, regardless of how the source
// file was originally exported.
const PADDING_RATIO = 1.1; // final canvas = trimmed content * this, so content always fills ~91% of the tile

// sharp's trim() compares every edge pixel against a single reference
// color (the corner pixel) — it has no real understanding of the logo's
// actual subject. For logos with a soft gradient, drop shadow, or a
// background that's only subtly different from that corner color, this
// can walk the "trimmable" region deep into the real mark, producing a
// tiny fragment instead of the intended crop. If more than this fraction
// of either dimension would be removed, the detection is almost
// certainly wrong — skip trimming and use the image as-is rather than
// risk destroying the logo.
const MAX_TRIM_FRACTION = 0.55;

export async function trimAndPadLogo(buffer: Buffer): Promise<Buffer> {
  const original = sharp(buffer);
  const originalMeta = await original.metadata();

  let data: Buffer;
  let info: sharp.OutputInfo;
  try {
    ({ data, info } = await sharp(buffer)
      .trim({ threshold: 12 })
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true }));

    const widthDrop = 1 - info.width / (originalMeta.width ?? info.width);
    const heightDrop = 1 - info.height / (originalMeta.height ?? info.height);
    if (widthDrop > MAX_TRIM_FRACTION || heightDrop > MAX_TRIM_FRACTION) {
      throw new Error('trim result implausibly small, falling back to untrimmed image');
    }
  } catch {
    ({ data, info } = await sharp(buffer).ensureAlpha().toBuffer({ resolveWithObject: true }));
  }

  const side = Math.round(Math.max(info.width, info.height) * PADDING_RATIO);

  return sharp({
    create: {
      width: side,
      height: side,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: data, gravity: 'center' }])
    .png()
    .toBuffer();
}
