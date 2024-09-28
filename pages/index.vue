<script setup lang="ts">

import { ref } from 'vue';
import { useScoreStore } from '@/store/useScores';

useSeoMeta({
    title: 'Hockey Versus - Play',
    description: 'Hockey Versus play page'
});

const store = useScoreStore();

const gameState = ref(0);
const updating = ref(false);
const guessResult = ref(0);
const score = ref(-1);
const strikes = ref(3);

const playerA = ref({ name: '', goals: 0 });
const playerB = ref({ name: '', goals: 0 });

const effectTimeout = 250;

const startGame = async () => {
    await changePlayers();

    gameState.value = 1;
    score.value = 0;
    strikes.value = 3;
}

const backToMenu = () => {
    gameState.value = 0;
}

const pickPlayerA = async () => {
    if (updating.value) {
        return;
    }

    updating.value = true;

    checkGuess(playerA.value.goals, playerB.value.goals);
    
    await updateGame();

    updating.value = false;
}

const pickPlayerB = async () => {
    if (updating.value) {
        return;
    }

    updating.value = true;

    checkGuess(playerB.value.goals, playerA.value.goals);

    await updateGame();

    updating.value = false;
}

const checkGuess = (guess: number, compareTo: number) => {
    if (guess > compareTo) {
        score.value++;

        activateEffect(2);
    } else {
        strikes.value--;

        activateEffect(1);
    }
}

const activateEffect = (result: number) => {
    guessResult.value = result;
    setTimeout(() => {
        guessResult.value = 0;
    }, effectTimeout);
}

const updateGame = async () => {
    if (strikes.value == 0) {
        completeGame();
    }

    await changePlayers();
}

const changePlayers = async () => {
    const playerData = await $fetch<HockeyPlayer[]>('/api/players');

    playerA.value = playerData[0];
    playerB.value = playerData[1];
}

const completeGame = () => {
    store.addScore(score.value);
    gameState.value = 2;
}

</script>

<template>
    <Card v-if="gameState == 0">
        <template #title>How to Play</template>
        <template #content>
            <p>Pick the player with the higher amount of career goals. Get as many right before accumulating three strikes.</p>
            <Button label="Start" @click="startGame()" class="mt-5" />
        </template>
    </Card>
    <Card v-if="gameState == 1" :class="{ shake: (guessResult === 1), wrong: (guessResult === 1), right: (guessResult === 2) }">
        <template #title>
            Score: {{ score }}
            <Rating v-model="strikes" :stars="3">
                <template #onicon>
                    <img src="/assets/strike-on.svg" height="25px" width="25px" />
                </template>
                <template #officon>
                    <img src="/assets/strike-off.svg" height="25px" width="25px" />
                </template>
            </Rating>
        </template>
        <template #content>
            <Button :label="playerA.name" @click="pickPlayerA()" :disabled="updating" />
            vs
            <Button :label="playerB.name" @click="pickPlayerB()" :disabled="updating" />
        </template>
    </Card>
    <Card v-if="gameState === 2">
        <template #title>Game Over</template>
        <template #content>
            <p>Final Score: {{ score }}</p>
            <Button label="Try Again" @click="startGame()" class="mt-5 mr-2" />
            <Button label="Back to Menu" @click="backToMenu()" severity="secondary" class="mt-5" />
        </template>
    </Card>
</template>