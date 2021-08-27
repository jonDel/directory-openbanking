<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 100%">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="phase1" label="Fase 1" />
          <q-tab name="phase2" label="Fase 2" />
          <q-tab name="phase3" label="Fase 3" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="phase1">
            <directory-data-table
              :columns="phase1.columns"
              :title="phase1.title"
              :data="data.phaseOneAuthServers"
            />
          </q-tab-panel>

          <q-tab-panel name="phase2">
            <directory-data-table
              :columns="phase2.columns"
              :title="phase2.title"
              :data="data.phaseTwoAuthServers"
            />
          </q-tab-panel>

          <q-tab-panel name="phase3">
            <directory-data-table
              :columns="phase3.columns"
              :title="phase3.title"
              :data="data.phaseThreeAuthServers"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import DirectoryDataTable from 'src/components/DirectoryDataTable.vue'
import {phaseOneData, phaseTwoData, phaseThreeData, directoryApiUrl,
  filterData} from '../components/table_data/table_data'
import { Loading, QSpinnerIos } from 'quasar'

export default {
  components: {
    DirectoryDataTable
  },
  data() {
    return {
      tab: 'phase1',
      phase1: phaseOneData,
      phase2: phaseTwoData,
      phase3: phaseThreeData,
      data: {
        phaseOneAuthServers: [],
        phaseTwoAuthServers: [],
        phaseThreeAuthServers: []
      },
    }
  },

  created() {
    Loading.show(
        {
          message: '<div class="text-h5 text-dark">Carregando dados das organizações...<div/>',
          html: true,
          spinnerColor: "primary",
          backgroundColor: "dark",
          spinnerSize: 140,
          spinner: QSpinnerIos
        }
    )

    this.$axios.get(directoryApiUrl,
    ).then(response => {
      // JSON responses are automatically parsed.
      this.data = filterData(response.data)
      this.loading = false;
      Loading.hide()
    })
    .catch(error => {
      Loading.hide()
      this.loading = false;
      console.log(error)
      if (error.response.status === 401) {
        console.log(error.response.data.detail)
      } else {
        showErrorMessage(error.response.data.detail)
      }
    })
  },
}
</script>
