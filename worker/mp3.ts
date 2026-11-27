const ID3_HEADER_SIZE = 10

// Layer III bitrates in kbps, by MPEG version, indexed by the header's bitrate bits
const BITRATES_MPEG1 = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320,
]
const BITRATES_MPEG2 = [
  0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160,
]

// Sample rates in Hz, by the header's version bits (3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5)
const SAMPLE_RATES: Record<number, number[]> = {
  3: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  0: [11025, 12000, 8000],
}

const readSyncsafe = (bytes: Uint8Array, offset: number): number =>
  ((bytes[offset]! & 0x7f) << 21) |
  ((bytes[offset + 1]! & 0x7f) << 14) |
  ((bytes[offset + 2]! & 0x7f) << 7) |
  (bytes[offset + 3]! & 0x7f)

const readUint32 = (bytes: Uint8Array, offset: number): number =>
  ((bytes[offset]! << 24) |
    (bytes[offset + 1]! << 16) |
    (bytes[offset + 2]! << 8) |
    bytes[offset + 3]!) >>>
  0

const readAscii = (bytes: Uint8Array, offset: number, length: number): string =>
  String.fromCharCode(...bytes.subarray(offset, offset + length))

/**
 * The size of the ID3v2 tag at the start of the file, header and footer
 * included, or 0 when the file has no tag.
 */
export const getTagSize = (bytes: Uint8Array): number => {
  if (bytes.length < ID3_HEADER_SIZE || readAscii(bytes, 0, 3) !== 'ID3') {
    return 0
  }

  const hasFooter = (bytes[5]! & 0x10) !== 0

  return (
    ID3_HEADER_SIZE + readSyncsafe(bytes, 6) + (hasFooter ? ID3_HEADER_SIZE : 0)
  )
}

/**
 * The duration in seconds of an MPEG Layer III file, from the first frame
 * after `offset`. Uses the Xing/Info frame count when the file has one, and
 * otherwise assumes a constant bitrate across `fileSize`. Returns undefined
 * when no valid frame is found in `bytes`.
 */
export const getDuration = (
  bytes: Uint8Array,
  offset: number,
  fileSize: number
): number | undefined => {
  for (let i = offset; i + 4 <= bytes.length; i++) {
    if (bytes[i] !== 0xff || (bytes[i + 1]! & 0xe0) !== 0xe0) continue

    const header = readUint32(bytes, i)
    const version = (header >>> 19) & 3
    const layer = (header >>> 17) & 3
    const bitrateIndex = (header >>> 12) & 15
    const sampleRateIndex = (header >>> 10) & 3
    const isMono = ((header >>> 6) & 3) === 3

    // Layer III only, and skip reserved values that mark a false sync
    if (layer !== 1 || version === 1 || sampleRateIndex === 3) continue
    if (bitrateIndex === 0 || bitrateIndex === 15) continue

    const isMpeg1 = version === 3
    const sampleRate = SAMPLE_RATES[version]![sampleRateIndex]!
    const samplesPerFrame = isMpeg1 ? 1152 : 576
    const sideInfoSize = isMpeg1 ? (isMono ? 17 : 32) : isMono ? 9 : 17
    const xingOffset = i + 4 + sideInfoSize

    if (xingOffset + 12 <= bytes.length) {
      const marker = readAscii(bytes, xingOffset, 4)
      const hasFrameCount = (readUint32(bytes, xingOffset + 4) & 1) !== 0

      if ((marker === 'Xing' || marker === 'Info') && hasFrameCount) {
        const frames = readUint32(bytes, xingOffset + 8)

        return (frames * samplesPerFrame) / sampleRate
      }
    }

    const bitrate =
      (isMpeg1 ? BITRATES_MPEG1 : BITRATES_MPEG2)[bitrateIndex]! * 1000

    return ((fileSize - i) * 8) / bitrate
  }

  return undefined
}
