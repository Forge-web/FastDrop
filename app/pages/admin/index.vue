<script setup lang="ts">
definePageMeta({
	middleware: 'admin-middleware'
})

import SidebarAdmin from '~/components/admin/base/SidebarAdmin.vue';
import ArrSidebarItems from '~/components/admin/ArrSidebarItems';

</script>

<template>

	<SidebarAdmin :items="ArrSidebarItems" />

</template>