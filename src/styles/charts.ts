import { VictoryThemeDefinition } from 'victory'

const gray700 = '#aaa'
const gray900 = '#ccc'

const fontFamily = 'VCR, sans-serif'
const letterSpacing = 'normal'
const fontSize = 16

const baseLabelStyles = {
  fontFamily,
  fontSize,
  padding: 10,
  letterSpacing,
  fill: gray900
}

export const theme: VictoryThemeDefinition = {
  area: {
    style: {
      data: {
        fill: 'rgb(31 41 55 / 0.8)',
        opacity: 1,
        stroke: gray900,
        strokeWidth: 1
      },
      labels: baseLabelStyles
    }
  },
  axis: {
    style: {
      axis: {
        stroke: '#aaa',
        strokeWidth: 2
      },
      grid: {
        stroke: '#33333380'
      },
      tickLabels: { ...baseLabelStyles, fill: gray900 }
    }
  },
  line: {
    style: {
      data: {
        fill: 'transparent',
        opacity: 1,
        stroke: gray900,
        strokeWidth: 0.5
      },
      labels: baseLabelStyles
    }
  },
  tooltip: {
    style: {
      fontFamily: 'Space Mono, monospace',
      fontSize: 14,
      padding: 5,
      letterSpacing,
      fill: gray900
    },
    flyoutStyle: {
      fontFamily: 'Space Mono',
      stroke: gray700,
      strokeWidth: 0.5,
      pointerEvents: 'none'
    },
    cornerRadius: 5,
    pointerLength: 10
  },
  voronoi: {
    style: {
      flyout: {
        fill: '#111',
        pointerEvents: 'none'
      }
    }
  }
}
