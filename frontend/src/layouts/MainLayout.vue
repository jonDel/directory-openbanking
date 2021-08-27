<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar square size="100%">
            <img src="~assets/banri_logo_transp.png">
          </q-avatar>
          Consulta ao diretório do Open Banking
        </q-toolbar-title>

      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

})
</script>
