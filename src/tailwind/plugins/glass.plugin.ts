import plugin from 'tailwindcss/plugin'

export default plugin(({ addUtilities }) => {
  addUtilities({
    '.glass': {
      backdropFilter: 'blur(20px)',
      background: 'transparent',

      '&--dark': {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
      },
    },
  })
})
