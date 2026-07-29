import sharp from 'sharp';

// Uploaded company/employer logos vary wildly in how much blank canvas
// surrounds the actual mark — some are cropped tight, others ship with a
// lot of padding baked into the file. Rendered at a fixed tile size with
// object-cover, that inconsistency reads as "some logos are bigger than
// others" even though every tile is pixel-identical. Trimming to the
// mark's bounding box and re-padding to a fixed ratio makes every logo
// occupy the same proportion of its tile, regardless of how the source
// file was originally exported.
const PADDING_RATIO = 1.4; // final canvas = trimmed content * this, so content always fills ~71% of the tile

export async function trimAndPadLogo(buffer: Buffer): Promise<Buffer> {
  const trimmed = sharp(buffer).trim({ threshold: 12 });
  const { data, info } = await trimmed.ensureAlpha().toBuffer({ resolveWithObject: true });

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
