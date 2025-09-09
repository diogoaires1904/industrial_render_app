import { colord } from 'colord';

const colors = createVariations({
    transparent: '#FFFFFF00',
    current: 'currentColor',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF0000',
    brown: '#AA7B51',
    dark: '#292839',
    primary: {
        100: '#F5F5F5',
        200: '#E0E0E0',
        300: '#BDBDBD',
        400: '#9E9E9E',
        500: '#757575',
        600: '#616161',
        700: '#424242',
        800: '#212121',
        900: '#121212',
        DEFAULT: '#80888d',
    },
});

export const theme = {
    colors,
    fontFamily: {
        sans: ['Aeonik', 'sans-serif'],
    },
} as any;

export default theme;

function createVariations(colors: any) {
    const variations: any = {};
    for (const color in colors) {
        if (['transparent', 'current', 'black', 'white'].includes(color)) {
            variations[color] = colors[color];
            continue;
        }
        if (typeof colors[color] === 'object') {
            for (const shade in colors[color]) {
                if (shade.toUpperCase() != 'DEFAULT') variations[`${color}-${shade}`] = colors[color][shade];
                else variations[color] = colors[color][shade];
            }
            continue;
        }

        variations[color] = colors[color];
        const col = colord(colors[color]);
        for (let i = 0.05; i <= 0.2; i += 0.05) {
            variations[`${color}-${Math.abs(Math.round(i * 2000 - 500))}`] = col.lighten(i).toHex();
        }
        for (let i = 0.05; i <= 0.2; i += 0.05) {
            variations[`${color}-${Math.abs(Math.round(i * 2000 + 500))}`] = col.darken(i).toHex();
        }
    }
    return variations;
}

export function vuetifyColors() {
    const vuetifyColors: any = {};
    for (const color in theme.colors) {
        if (['transparent', 'current'].includes(color)) continue;
        vuetifyColors[color] = theme.colors[color];
    }
    return vuetifyColors;
}

export function tailwindColors() {
    const tailwindColors: any = {};
    for (const color in theme.colors) {
        if (['transparent', 'current'].includes(color)) {
            tailwindColors[color] = theme.colors[color];
            continue;
        }
        tailwindColors[color] = `rgba(var(--v-theme-${color}), <alpha-value>)`;
    }

    return tailwindColors;
}
