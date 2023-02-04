export const bufferToBlob = (buffer: number[]): Blob =>
  new Blob([new Uint8Array(buffer)])

export const bufferToObjectURL = (buffer: number[]): string =>
  window.URL.createObjectURL(bufferToBlob(buffer))
