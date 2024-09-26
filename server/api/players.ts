const getPlayer = async (playerId: number) => {
    var resp = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
    
    if (resp.ok) {
        const body = await resp.json();
    
        return {
            name: body.firstName.default + ' ' + body.lastName.default,
            goals: body.careerTotals.regularSeason.goals + body.careerTotals.playoffs.goals
        }
    } else {
        return {
            name: 'Failed to retrieve player',
            goals: 500
        }
    }
}

export default defineEventHandler(async (event) => {
    try {
        const playerIds = [8471675, 8477934, 8475167, 8476453, 8477492, 8479318, 8478402, 8471214, 8478550, 8477956]
        const playerIdA = playerIds[Math.floor(Math.random() * playerIds.length)];
        let playerIdB = playerIds[Math.floor(Math.random() * playerIds.length)];

        while (playerIdA === playerIdB) {
            playerIdB = playerIds[Math.floor(Math.random() * playerIds.length)];
        }

        const players = [];

        players.push(await getPlayer(playerIdA));
        players.push(await getPlayer(playerIdB));

        return [...players]
    } catch(error) {
        return [{
                name: error,
                goals: 500
            }]
    }

  })
  