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
        addScore(score: number) {
            this.scores.push({timestamp: Date.now(), score: score });
        }
    }
});

interface Score {
    timestamp: number,
    score: number
}