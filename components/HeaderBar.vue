<script setup>

import { ref } from "vue";

const items = ref([
    {
        label: 'Play',
        icon: 'pi pi-home',
        route: '/'
    },
    {
        label: 'Scores',
        icon: 'pi pi-star',
        route: '/scores'
    },
    {
        label: 'About',
        icon: 'pi pi-envelope',
        route: '/about'
    }
]);

</script>

<template>
    <div>
        <Menubar :model="items" class="border-none">
            <template #start>
                <img src="/assets/logo.svg" height="45px" width="45px" />
            </template>
            <template #item="{ item, props, hasSubmenu }">
                <nuxt-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </nuxt-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
        </Menubar>
        <Divider />
    </div>
</template>