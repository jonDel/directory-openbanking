<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :rows="data"
      :columns="columns"
      row-key="AuthorisationServerId"
      rows-per-page-label="Entradas por página:"
      :filter="filter"
      :dense="$q.screen.lt.md"
      :pagination="initialPagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-markup-table :dense="q_table_dense" separator="vertical" flat bordered>
              <thead>
                <tr>
                  <th class="text-left">CustomerFriendlyName</th>
                  <th class="text-left">CustomerFriendlyDescription</th>
                  <th class="text-left">CustomerFriendlyLogoUri</th>
                  <th class="text-left">OpenIDDiscoveryDocument</th>
                  <th class="text-left">AuthorisationServerId</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">{{ props.row.CustomerFriendlyName }}</td>
                  <td class="text-left"> {{ props.row.CustomerFriendlyDescription }}</td>
                  <td>
                  <img :src="props.row.CustomerFriendlyLogoUri" :alt="props.row.CustomerFriendlyLogoUri" width="200" height="240">
                  </td>
                  <td class="text-left">{{ props.row.OpenIDDiscoveryDocument }}</td>
                  <td class="text-left">{{ props.row.AuthorisationServerId }}</td>
                </tr>
              </tbody>
            </q-markup-table>              
            <br>
            <q-markup-table :dense="q_table_dense" separator="vertical" flat bordered>
              <thead>

                <tr>
                  <th colspan="5">
                    <div class="row no-wrap items-center">
                      <div class="text-left">ApiResources</div>
                    </div>
                  </th>
                </tr>

                <tr>
                  <th class="text-left">ApiFamilyType</th>
                  <th class="text-left">ApiDiscoveryEndpoints</th>
                  <th class="text-left">ApiVersion</th>
                </tr>
              </thead>
              <tbody v-for="apiResource in props.row.ApiResources" :key="apiResource.ApiResourceId">
                <tr>
                  <td class="text-left">{{ apiResource.ApiFamilyType}}</td>
                  <td class="text-left">
                    <q-markup-table :dense="q_table_dense" separator="vertical" flat bordered>
                      <tbody v-for="apiEndpoint in apiResource.ApiDiscoveryEndpoints" :key="apiEndpoint.ApiDiscoveryId">
                        <tr>
                          <td class="text-left">{{ apiEndpoint.ApiEndpoint }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>              
                  </td>
                  <td class="text-left">{{ apiResource.ApiVersion }}</td>
                </tr>
              </tbody>
            </q-markup-table>              
          </q-td>
        </q-tr>
      </template>

       <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Busca">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>
  </div>
</template>
<script>

export default {
  name: "DirectoryDataTable",
  props: {
    data: {
      type: Array,
      required: true
    }, 
    columns: {
      type: Array,
      required: true
    }, 
    title: {
      type: String,
      required: true
    },
  },
  setup() {
    return {
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      q_table_dense: true
    }
  },
  data() {
    return {
      filter: ''
    }
  },

}

</script>
<style lang="scss" scoped>
  .q-table--no-wrap th, .q-table--no-wrap td {
    white-space: normal;
}
</style>
