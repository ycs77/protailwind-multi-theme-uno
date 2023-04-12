import {
  colorToString,
  colorOpacityToString,
  handler as h,
  hex2rgba,
  parseCssColor,
} from '@unocss/preset-mini/utils'

function getRgbChannels(color) {
  return hex2rgba(color).slice(0, 3).join(' ')
}

function mutilColorResolver(property, varName, resolveColor) {
  return ([, c], { theme }) => {
    const color = resolveColor(c, theme)
    if (color) {
      return {
        [`--un-${varName}-opacity`]: colorOpacityToString(parseCssColor(color)),
        [property]: colorToString(color, `var(--un-${varName}-opacity)`),
      }
    }
  }
}

export function presetMultiTheme(themes) {
  const theme = Object
    .entries(themes[0].colors)
    .reduce((config, [colorKey, color]) => {
      let [property, name] = colorKey.split('-')
      property = property
        .replace(/^text$/, 'textColor')
        .replace(/^bg$/, 'backgroundColor')
      config[property] ??= {}
      config[property].multi ??= {}
      config[property].multi[name] = `rgb(var(--color-${colorKey}) / <alpha-value>)`
      return config
    }, {})

  /**
   * @example text-multi-base text-multi-inverted
   */
  const textColors = [
    [
      /^(?:text|color|c)-multi-(.+)$/,
      mutilColorResolver('color', 'text', (c, theme) => theme.textColor.multi[c]),
      { autocomplete: '(text|color|c)-multi-$colors' },
    ],
    [
      /^(?:text|color|c)-op(?:acity)?-?(.+)$/,
      ([, opacity]) => ({ '--un-text-opacity': h.bracket.percent(opacity) }),
      { autocomplete: '(text|color|c)-(op|opacity)-<percent>' },
    ],
  ]

  /**
   * @example bg-multi-base bg-multi-inverted
   */
  const bgColors = [
    [
      /^bg-multi-(.+)$/,
      mutilColorResolver('background-color', 'bg', (c, theme) => theme.backgroundColor.multi[c]),
      { autocomplete: 'bg-multi-$colors' },
    ],
    [
      /^bg-op(?:acity)?-?(.+)$/,
      ([, opacity]) => ({ '--un-bg-opacity': h.bracket.percent(opacity) }),
      { autocomplete: 'bg-(op|opacity)-<percent>' },
    ],
  ]

  const themeVariant = {
    name: 'theme',
    match: matcher => {
      const theme = themes.find(({ name }) => matcher.startsWith(`theme-${name}:`))
      if (theme) {
        return {
          matcher: matcher.slice(`theme-${theme.name}:`.length),
          selector: s => `[data-theme="${theme.name}"] ${s}`,
        }
      }
    },
    autocomplete: `theme-(${themes.map(({ name }) => name).join('|')}):`,
  }

  const defaultThemeVars = {
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
  }

  const mutilThemeVars = {
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
  }

  return {
    name: 'preset-multi-theme',
    theme,
    rules: [
      ...textColors,
      ...bgColors,
    ],
    variants: [themeVariant],
    preflights: [defaultThemeVars, mutilThemeVars],
  }
}

export default presetMultiTheme
