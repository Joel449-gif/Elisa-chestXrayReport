/**
 * Polyfill ImageData for jsdom test environment.
 */
if (typeof globalThis.ImageData === "undefined") {
  class ImageDataPolyfill {
    data: Uint8ClampedArray
    width: number
    height: number

    constructor(width: number, height: number) {
      this.width = width
      this.height = height
      this.data = new Uint8ClampedArray(width * height * 4)
    }
  }

  globalThis.ImageData = ImageDataPolyfill as unknown as typeof ImageData
}
