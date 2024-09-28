<script setup lang="ts">

import { ref } from 'vue';
import { useScoreStore } from '@/store/useScores';

useSeoMeta({
    title: 'Hockey Versus - Scores',
    description: 'Hockey Versus scores page'
});

const store = useScoreStore();

const scores = ref(store.userScores);

</script>

<template>
    <Card>
        <template #title>
            Scores
        </template>
        <template #content v-if="scores.length > 0">
            <DataTable :value="scores">
                <Column field="timestamp" header="Timestamp">
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.timestamp).toLocaleString('en-US') }}
                    </template>
                </Column>
                <Column field="mode" header="Mode">
                    <template #body="slotProps">
                        {{ translateGameModeFancy(slotProps.data.mode.toString()) }}
                    </template>
                </Column>
                <Column field="score" header="Score"></Column>
            </DataTable>
        </template>
        <template #content v-if="scores.length === 0">
            Play a round to see your scores here.
        </template>
    </Card>
</template>