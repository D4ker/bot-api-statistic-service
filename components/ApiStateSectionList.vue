<template>
  <div>
    <div v-if="loading" class="api-state__loader">
      <ApiStateSectionListLoader/>
    </div>
    <div v-else class="methods-container">
      <a-tabs type="card" :activeKey="viewModeFilter">
        <a-tab-pane key="list" tab="">
          <div class="methods-list">
            <div class="method" v-for="method in filteredApiState" :key="method.id">
              <div class="method__body">
                <p class="method__name">{{ method.fullname }}</p>
                <div class="method__result">
                  <a-icon class="method__check" type="check-circle"/>
                  <p class="method__time">{{ cropNum(method.averageResponseMS) }} мс</p>
                  <p class="method__success">{{ cropNum(method.successRate) }}%</p>
                </div>
              </div>
              <hr>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="cards" tab="" :forceRender="true">
          <div class="methods-cards">
            <a-card class="method-card" v-for="method in filteredApiState" :key="method.id"
                    :title="`${method.fullname}`">
              <div class="method-card__body">
                <div class="method-card__result">
                  <a-icon class="method__check" type="check-circle"/>
                  <p class="method__time">{{ cropNum(method.averageResponseMS) }} мс</p>
                  <p class="method__success">{{ cropNum(method.successRate) }}%</p>
                </div>
                <hr>
                <div v-show="methodsPeriodFilter === '7-days'" class="method__chart">
                  <apexchart type="area" height="100%" :options="method.chartsOptions[7]"
                             :series="method.chartsSeries[7]"></apexchart>
                </div>
                <div v-show="methodsPeriodFilter === '30-days'" class="method__chart">
                  <apexchart type="area" height="100%" :options="method.chartsOptions[30]"
                             :series="method.chartsSeries[30]"></apexchart>
                </div>
              </div>
            </a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import ApiStateSectionListLoader from './ApiStateSectionListLoader';

export default {
  props: {
    methodsSortFilter: {
      type: String,
      required: true
    },
    methodsPeriodFilter: {
      type: String,
      required: true
    },
    viewModeFilter: {
      type: String,
      required: true
    }
  },
  components: {
    ApiStateSectionListLoader
  },
  data() {
    return {
      localApiState: [],
      loading: true
    }
  },
  computed: {
    apiState() {
      return this.$store.getters['api-state/apiState'].slice();
    },
    filteredApiState() {
      const currentApiState = this.apiState;
      if (this.methodsSortFilter === 'name') {
        return currentApiState.sort((m1, m2) => {
          const name1 = m1.fullname.toLowerCase();
          const name2 = m2.fullname.toLowerCase();
          return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
        });
      } else if (this.methodsSortFilter === 'time') {
        return currentApiState.sort((m1, m2) => {
          return m2.averageResponseMS - m1.averageResponseMS;
        });
      } else if (this.methodsSortFilter === 'success') {
        return currentApiState.sort((m1, m2) => {
          return m1.successRate - m2.successRate;
        });
      }
      return currentApiState;
    }
  },
  async mounted() {
    this.loading = false;
  },
  methods: {
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    }
  }
};
</script>

<style scoped lang="scss">
.api-state__loader {
  display: flex;
  justify-content: center;
}

.methods-container {

  ::v-deep .ant-tabs.ant-tabs-card .ant-tabs-card-content > .ant-tabs-tabpane {
    transition: opacity 0.45s !important;
  }

  ::v-deep .ant-tabs-bar {
    display: none;
  }

  .methods-list {
    .method {
      .method__body {
        display: flex;
        justify-content: space-between;
        padding: 15px 10px;

        .method__name {
          word-break: break-all;
        }

        .method__result {
          display: grid;
          grid-template-columns: auto 70px 70px;
          align-items: center;
          column-gap: 5px;

          .method__time {
            justify-self: end;
          }

          .method__success {
            justify-self: end;
          }
        }
      }
    }
  }

  .methods-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc((#{$small-resolution} - 40px) / 2), 1fr));
    gap: 20px;
    margin-top: 24px;
    justify-content: center;

    @media (max-width: $small-resolution) {
      grid-template-columns: minmax(100%, auto);
    }

    .method-card {
      .method-card__result {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      hr {
        margin: 12px 0;
      }

      .method__chart {
        height: 250px;
      }
    }
  }

  .method__success {
    color: $color-gray-light;
  }

  .method__check {
    color: #52c41a;
  }

  p {
    color: black;
    margin: 0;
  }

  hr {
    border: 0;
    margin: 0;
    border-top: 1px solid #ccc;
  }
}
</style>
