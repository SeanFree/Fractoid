import { ShaderProgram } from '~/core/ShaderProgram'
import { afterAll, beforeEach, expect, describe, it, test, vi } from 'vitest'
import { SHADER_OPTIONS_DEFAULT } from '~/consts'

describe('ShaderProgram', () => {
  const vertSource = 'vert-shader-mock'
  const fragSource = 'frag-shader-mock'

  const mockCanvas = {
    getContext: vi.fn(),
    style: {},
  } as unknown as HTMLCanvasElement

  const mockParentElement = {
    firstChild: {},
    insertBefore: vi.fn(),
    removeChild: vi.fn(),
  } as unknown as HTMLElement

  const mockGl = {
    attachShader: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    canvas: mockCanvas,
    clear: vi.fn(),
    clearColor: vi.fn(),
    compileShader: vi.fn(),
    createBuffer: vi.fn(),
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(),
    deleteShader: vi.fn(),
    drawArrays: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getAttribLocation: vi.fn(),
    getContext: vi.fn(),
    getProgramInfoLog: vi.fn(),
    getProgramParameter: vi.fn(),
    getShaderInfoLog: vi.fn(),
    getShaderParameter: vi.fn(),
    getUniformLocation: vi.fn(),
    linkProgram: vi.fn(),
    shaderSource: vi.fn(),
    uniform1f: vi.fn(),
    uniform1fv: vi.fn(),
    uniform1i: vi.fn(),
    uniform1iv: vi.fn(),
    uniform2f: vi.fn(),
    uniform2fv: vi.fn(),
    uniform2i: vi.fn(),
    uniform2iv: vi.fn(),
    uniform3f: vi.fn(),
    uniform3fv: vi.fn(),
    uniform3i: vi.fn(),
    uniform3iv: vi.fn(),
    uniform4f: vi.fn(),
    uniform4fv: vi.fn(),
    uniform4i: vi.fn(),
    uniform4iv: vi.fn(),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
    viewport: vi.fn(),
  } as unknown as WebGL2RenderingContext

  const mockResizeObserver = {
    observe: vi.fn(),
  } as unknown as ResizeObserver

  let program: ShaderProgram

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(mockCanvas.getContext).mockReturnValue(mockGl)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    vi.spyOn(window, 'ResizeObserver').mockImplementation(function () {
      return mockResizeObserver
    })
    vi.spyOn(document, 'createElement').mockImplementation(() => mockCanvas)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('create', () => {
    beforeEach(() => {
      vi.mocked(mockGl.getShaderParameter).mockReturnValue(true)
      vi.mocked(mockGl.getProgramParameter).mockReturnValue(true)
    })

    it('should initialize', () => {
      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
      })

      expect(program).toBeDefined()
    })

    it('should create a new canvas if gl is not provided', () => {
      const options = {
        attachTo: mockParentElement,
      }

      program = new ShaderProgram({
        vertSource,
        fragSource,
        options,
      })

      expect(document.createElement).toHaveBeenCalledWith('canvas')
      expect(options.attachTo.insertBefore).toHaveBeenCalledWith(
        mockCanvas,
        options.attachTo.firstChild
      )
    })

    it('should apply default canvas styles if none are provided', () => {
      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
      })

      expect(program.canvas.style).toEqual(SHADER_OPTIONS_DEFAULT.canvasStyle)
    })

    it('should setup a resize observer when options.autoResize is true', () => {
      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
        options: {
          autoResize: true,
        },
      })

      expect(window.ResizeObserver).toHaveBeenCalled()
      expect(mockResizeObserver.observe).toHaveBeenCalledWith(document.body)
    })

    it('should start animation loop if options.animate is true', () => {
      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
        options: {
          animate: true,
        },
      })

      expect(window.requestAnimationFrame).toHaveBeenCalledWith(
        expect.any(Function)
      )
    })
  })

  describe('error handling', () => {
    it('should log an error if program link fails', () => {
      vi.mocked(mockGl.getProgramParameter).mockReturnValue(false)
      vi.spyOn(console, 'error').mockImplementation(() => {})

      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
      })

      expect(console.error).toHaveBeenCalledWith(expect.any(String), undefined)
    })

    it('should log an error if create shader fails', () => {
      vi.mocked(mockGl.getShaderParameter).mockReturnValue(false)

      vi.spyOn(console, 'error').mockImplementation(() => {})

      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
      })

      expect(console.error).toHaveBeenCalledWith(expect.any(String), undefined)
    })
  })

  describe('uniform methods', () => {
    const location = {} as unknown as WebGLUniformLocation

    test.each([
      ['uniform1f', 1],
      ['uniform1fv', [1]],
      ['uniform1i', 1],
      ['uniform1iv', [1]],
      ['uniform2f', [1, 1]],
      ['uniform2fv', [1, 1]],
      ['uniform2i', [1, 1]],
      ['uniform2iv', [1, 1]],
      ['uniform3f', [1, 1, 1]],
      ['uniform3fv', [1, 1, 1]],
      ['uniform3i', [1, 1, 1]],
      ['uniform3iv', [1, 1, 1]],
      ['uniform4f', [1, 1, 1, 1]],
      ['uniform4fv', [1, 1, 1, 1]],
      ['uniform4i', [1, 1, 1, 1]],
      ['uniform4iv', [1, 1, 1, 1]],
    ])('program.$0 should call gl.$0', (method, arg) => {
      program = new ShaderProgram({
        vertSource,
        fragSource,
        gl: mockGl,
      })

      // @ts-expect-error - not worth typing this
      program[method](location, arg)

      if (method.includes('1') || method.endsWith('v')) {
        // @ts-expect-error - not worth typing this
        expect(mockGl[method]).toHaveBeenCalledWith(location, arg)
      } else {
        // @ts-expect-error - not worth typing this
        expect(mockGl[method]).toHaveBeenCalledWith(location, ...arg)
      }
    })
  })
})
