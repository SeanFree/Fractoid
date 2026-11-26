import { vi } from 'vitest'
import { MockAnalyserNode, MockAudioContext } from './mocks/webAudio'

vi.stubGlobal('AnalyserNode', MockAnalyserNode)
vi.stubGlobal('AudioContext', MockAudioContext)
