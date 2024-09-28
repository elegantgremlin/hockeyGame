export const translateGameMode = (mode: string) => {
    switch(mode) {
        case '1':
            return 'assists';
        case '2':
            return 'points';
        case '3':
            return 'plusMinus';
        case '4':
            return 'pim';
        case '0':
        default:
            return 'goals';
    }
}

export const translateGameModeFancy = (mode: string) => {
    switch(mode) {
        case '1':
            return 'Assists';
        case '2':
            return 'Points';
        case '3':
            return 'Plus/Minus';
        case '4':
            return 'PIM';
        case '0':
        default:
            return 'Goals';
    }
}