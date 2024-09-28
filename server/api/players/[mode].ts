const getPlayer = async (playerId: number, mode: string) => {
    var resp = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
    
    if (resp.ok) {
        const body = await resp.json();
    
        return {
            name: body.firstName.default + ' ' + body.lastName.default,
            statValue: body.careerTotals.regularSeason[mode] + body.careerTotals.playoffs[mode]
        };
    } else {
        return {
            name: 'Failed to retrieve player',
            statValue: 500
        };
    }
}

const translateGameMode = (mode: string) => {
    switch(mode) {
        case '1':
            return 'assists';
        case '2':
            return 'points';
        case '3':
            return 'plusMinus';
        case '0':
        default:
            return 'goals';
    }
}

export default defineEventHandler(async (event) => {
    try {
        const mode = getRouterParam(event, 'mode');

        const playerIds = [8471675, 8477934, 8475167, 8476453, 8477492, 8479318, 8478402, 8471214, 8478550, 8477956]
        const playerIdA = playerIds[Math.floor(Math.random() * playerIds.length)];
        let playerIdB = playerIds[Math.floor(Math.random() * playerIds.length)];

        while (playerIdA === playerIdB) {
            playerIdB = playerIds[Math.floor(Math.random() * playerIds.length)];
        }

        const players = [];

        players.push(await getPlayer(playerIdA, translateGameMode(mode!)));
        players.push(await getPlayer(playerIdB, translateGameMode(mode!)));

        return [...players];
    } catch(error) {
        return [{
                name: error,
                statValue: 500
            }];
    }
  })
  