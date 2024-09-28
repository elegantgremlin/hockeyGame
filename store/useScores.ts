import { defineStore } from 'pinia';

export const useScoreStore = defineStore('scores', {
    state: () => {
        return {
            scores: [] as Score[] 
        } 
    },
    getters: {
        userScores: (state) => state.scores,
    },
    actions: {
        addScore(score: number, gameMode: number) {
            this.scores.push({timestamp: Date.now(), score: score, mode: gameMode });
        }
    }
});

interface Score {
    timestamp: number,
    score: number
    mode: number
}