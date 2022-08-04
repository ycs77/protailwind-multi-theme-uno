import {
  colorToString,
  colorOpacityToString,
  handler as h,
  hex2rgba,
  parseCssColor,
} from '@unocss/preset-mini/utils'

const getRgbChannels = color => hex2rgba(color).slice(0, 3).join(' ')

export const presetMultiTheme = themes => ({
  name: 'preset-multi-theme',

  theme: {
    textColor: {
      multi: {
        base: 'rgb(var(--color-text-base) / <alpha-value>)',
        inverted: 'rgb(var(--color-text-inverted) / <alpha-value>)',
      },
    },
    backgroundColor: {
      multi: {
        base: 'rgb(var(--color-bg-base) / <alpha-value>)',
        inverted: 'rgb(var(--color-bg-inverted) / <alpha-value>)',
      },
    },
  },

  rules: [
    // text color rules
    [/^(?:text|color|c)-multi-(.+)$/, ([, c], { theme }) => {
      if (theme.textColor.multi[c]) {
        return {
          '--un-text-opacity': colorOpacityToString(parseCssColor(theme.textColor.multi[c])),
          color: colorToString(theme.textColor.multi[c], 'var(--un-text-opacity)'),
        }
      }
    }, { autocomplete: '(text|color|c)-multi-$colors' }],
    [/^(?:text|color|c)-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-text-opacity': h.bracket.percent(opacity) }), { autocomplete: '(text|color|c)-(op|opacity)-<percent>' }],

    // background color rules
    [/^bg-multi-(.+)$/, ([, c], { theme }) => {
      if (theme.backgroundColor.multi[c]) {
        return {
          '--un-bg-opacity': colorOpacityToString(parseCssColor(theme.backgroundColor.multi[c])),
          'background-color': colorToString(theme.backgroundColor.multi[c], 'var(--un-bg-opacity)'),
        }
      }
    }, { autocomplete: 'bg-multi-$colors' }],
    [/^bg-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-bg-opacity': h.bracket.percent(opacity) }), { autocomplete: 'bg-(op|opacity)-<percent>' }],
  ],

  variants: [
    {
      name: 'theme',
      match: matcher => {
        const theme = themes.find(({ name }) => matcher.startsWith(`theme-${name}:`))
        if (theme) {
          return {
            matcher: matcher.slice(`theme-${theme.name}:`.length),
            selector: s => `[data-theme=${theme.name}] ${s}`,
          }
        }
      },
      autocomplete: `theme-(${themes.map(({ name }) => name).join('|')}):`,
    },
  ],

  preflights: [
    {
      getCSS() {
        // default theme
        const defaultThemeColors = themes[0].colors
        return `
          :root {
            --color-text-base: ${getRgbChannels(defaultThemeColors['text-base'])};
            --color-text-inverted: ${getRgbChannels(defaultThemeColors['text-inverted'])};
            --color-bg-base: ${getRgbChannels(defaultThemeColors['bg-base'])};
            --color-bg-inverted: ${getRgbChannels(defaultThemeColors['bg-inverted'])};
          }
        `
      },
    },
    {
      getCSS() {
        // mutil theme
        return themes.reduce((code, { name, colors }) =>
          code + `
            [data-theme="${name}"] {
              --color-text-base: ${getRgbChannels(colors['text-base'])};
              --color-text-inverted: ${getRgbChannels(colors['text-inverted'])};
              --color-bg-base: ${getRgbChannels(colors['bg-base'])};
              --color-bg-inverted: ${getRgbChannels(colors['bg-inverted'])};
            }
          `
        , '')
      },
    },
  ],
})

export default presetMultiTheme
