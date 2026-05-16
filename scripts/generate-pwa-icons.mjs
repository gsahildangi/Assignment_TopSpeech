/**
 * Renders public/icons/icon-source.svg into installable PNG sizes.
 * Run: npm run icons
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'public/icons/icon-source.svg')
const outDir = join(root, 'public')

const sizes = [
  { name: 'pwa-192.png', size: 192 },
  { name: 'pwa-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

await mkdir(outDir, { recursive: true })

for (const { name, size } of sizes) {
  const buffer = await sharp(source)
    .resize(size, size, { fit: 'contain', background: '#0f766e' })
    .png()
    .toBuffer()
  await writeFile(join(outDir, name), buffer)
  console.log(`Wrote public/${name} (${size}x${size})`)
}
