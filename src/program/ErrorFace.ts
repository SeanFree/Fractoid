import { sample } from '@/utils'

export class ErrorFace {
  private static armChars = [
    ['/', '\\'],
    ['\\', '/'],
    ['>', '<'],
    ['<', '>'],
    ['-', '-'],
    ['~', '~'],
  ]
  private static faceChars = [
    ['[', ']'],
    ['{', '}'],
    ['(', ')'],
  ]
  private static eyeChars = [
    ['-', '-'],
    ['~', '~'],
    ['*', '*'],
    ['>', '<'],
    ['x', 'x'],
    ['v', 'v'],
    ['T', 'T'],
  ]
  private static mouthChars = ['o', 'O', '.', ';', '!', '=', '+']

  static getFace() {
    const [leftArm, rightArm] = sample(this.armChars)
    const [leftFace, rightFace] = sample(this.faceChars)
    const [leftEye, rightEye] = sample(this.eyeChars)
    const mouth = sample(this.mouthChars)

    return `${leftArm}${leftFace}${leftEye}${mouth}${rightEye}${rightFace}${rightArm}`
  }
}
