<script setup lang="ts">

import { ref } from 'vue';
import { useScoreStore } from '@/store/useScores';

useSeoMeta({
    title: 'Hockey Versus - Play',
    description: 'Hockey Versus play page'
});

const store = useScoreStore();

const gameState = ref(0);
const gameMode = ref('0');
const updating = ref(false);
const guessResult = ref(0);
const score = ref(-1);
const strikes = ref(3);
const answers = ref<LogEntry[]>([]);

const playerA = ref({ name: '', statValue: 0 });
const playerB = ref({ name: '', statValue: 0 });

const effectTimeout = 250;

const startGame = async () => {
    await changePlayers();

    gameState.value = 1;
    score.value = 0;
    strikes.value = 3;
    answers.value = [];
}

const backToMenu = () => {
    gameState.value = 0;
}

const pickPlayerA = async () => {
    if (updating.value) {
        return;
    }

    updating.value = true;

    const correct = checkGuess(playerA.value.statValue, playerB.value.statValue);

    addToLog(correct);
    
    await updateGame();

    updating.value = false;
}

const pickPlayerB = async () => {
    if (updating.value) {
        return;
    }

    updating.value = true;

    const correct = checkGuess(playerB.value.statValue, playerA.value.statValue);

    addToLog(correct);

    await updateGame();

    updating.value = false;
}

const addToLog = (correct: boolean) => {
    const rightAnswer = (playerA.value.statValue > playerB.value.statValue) ? playerA.value.name : playerB.value.name;

    answers.value.unshift({ playerA: playerA.value.name, playerB: playerB.value.name, rightAnswer: rightAnswer, correct: correct })
}

const checkGuess = (guess: number, compareTo: number) => {
    if (guess > compareTo) {
        score.value++;

        activateEffect(2);

        return true;
    } else {
        strikes.value--;
        
        activateEffect(1);
        
        return false;
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
    const playerData = await $fetch<HockeyPlayer[]>(`/api/players/${gameMode.value}`);

    playerA.value = playerData[0];
    playerB.value = playerData[1];
}

const completeGame = () => {
    store.addScore(score.value, Number(gameMode.value));
    gameState.value = 2;
}

</script>

<template>
    <Card v-if="gameState == 0">
        <template #title>How to Play</template>
        <template #content>
            <p>Pick the player with the higher amount of the selected stat. Get as many right before accumulating three strikes.</p>
            <br />
            <p>Choose stat:</p>
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center">
                    <RadioButton v-model="gameMode" inputId="gameMode0" name="mode" value="0" />
                    <label for="gameMode0" class="ml-2">Goals</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="gameMode" inputId="gameMode1" name="mode" value="1" />
                    <label for="gameMode1" class="ml-2">Assists</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="gameMode" inputId="gameMode2" name="mode" value="2" />
                    <label for="gameMode2" class="ml-2">Points</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="gameMode" inputId="gameMode3" name="mode" value="3" />
                    <label for="gameMode3" class="ml-2">Plus/Minus</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="gameMode" inputId="gameMode4" name="mode" value="4" />
                    <label for="gameMode4" class="ml-2">PIM</label>
                </div>
            </div>
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
            <LogTable :answers="answers" />
        </template>
    </Card>
    <Card v-if="gameState === 2">
        <template #title>Game Over</template>
        <template #content>
            <p>Final Score: {{ score }}</p>
            <LogTable :answers="answers" />
            <br />
            <div class="flex flex-wrap gap-4">
                <Button label="Try Again" @click="startGame()" />
                <Button label="Back to Menu" @click="backToMenu()" severity="secondary" />
            </div>
        </template>
    </Card>
</template>