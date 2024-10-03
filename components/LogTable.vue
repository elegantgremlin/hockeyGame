<script setup lang="ts">

const props = defineProps(['answers']);

</script>

<template>
    <DataTable :value="answers" v-if="answers.length > 0" :rowClass="({ correct }) => correct === true ? 'right' : 'wrong'">
        <Column field="playerA" header="Round">
            <template #body="slotProps">
                {{ slotProps.data.playerA }} vs {{ slotProps.data.playerB }}
            </template>
        </Column>
        <Column field="rightAnswer" header="Correct Answer"></Column>
    </DataTable>
</template>