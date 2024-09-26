<script setup lang="ts">

import { ref } from 'vue';
import { useScoreStore } from '@/store/useScores';

useSeoMeta({
    title: 'Hockey Versus - Play',
    description: 'Hockey Versus play page'
});

const store = useScoreStore();

const gameStarted = ref(false);
const updating = ref(false);
const score = ref(-1);
const strikes = ref(3);

const playerA = ref({ name: '', goals: 0 });
const playerB = ref({ name: '', goals: 0 });


const startGame = async () => {
    await changePlayers();

    gameStarted.value = true;
    score.value = 0;
    strikes.value = 3;
}

const pickPlayerA = async () => {
    updating.value = true;

    if (playerA.value.goals > playerB.value.goals) {
        score.value++;
    } else {
        strikes.value--;
    }
    
    await updateGame();

    updating.value = false;
}

const pickPlayerB = async () => {
    updating.value = true;

    if (playerA.value.goals < playerB.value.goals) {
        score.value++;
    } else {
        strikes.value--;
    }

    await updateGame();

    updating.value = false;
}

const updateGame = async () => {
    if (strikes.value == 0) {
        completeGame();
    }

    await changePlayers();
}

const changePlayers = async () => {
    const playerData = await $fetch<HockeyPlayer[]>('/api/players');

    playerA.value.name = playerData[0].name;
    playerA.value.goals = playerData[0].goals;
    playerB.value.name = playerData[1].name;
    playerB.value.goals = playerData[1].goals;
}

const completeGame = () => {
    store.addScore(score.value);
    gameStarted.value = false;
}

</script>

<template>
    <Card v-if="!gameStarted">
        <template #title>How to Play</template>
        <template #content>
            <p>Pick the player with the higher amount of career goals. Get as many right before accumulating three strikes.</p>
            <p v-if="score > -1">Previous Score: {{ score }}</p>
            <Button label="Start" @click="startGame()" class="mt-5" />
        </template>
    </Card>
    <Card v-if="gameStarted">
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
</template>