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
                <p class="method__name">{{ method.name }}</p>
                <div class="method__result">
                  <a-icon class="method__check" type="check-circle"/>
                  <p class="method__time">{{ cropNum(method.avarageResponseMS) }} мс</p>
                  <p class="method__success">{{ cropNum(method.successRate) }}%</p>
                </div>
              </div>
              <hr>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="cards" tab="" :forceRender="true">
          <div class="methods-cards">
            <a-card class="method-card" v-for="method in filteredApiState" :key="method.id" :title="method.name">
              <div class="method-card__body">
                <div class="method-card__result">
                  <a-icon class="method__check" type="check-circle"/>
                  <p class="method__time">{{ cropNum(method.avarageResponseMS) }} мс</p>
                  <p class="method__success">{{ cropNum(method.successRate) }}%</p>
                </div>
                <hr>
                <apexchart type="line" height="250" :options="chartsOptions[method.id]"
                           :series="chartsSeries[method.id]"></apexchart>
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
import Faker from "../modules/faker";

export default {
  props: {
    methodsSortFilter: {
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
      apiState: [],
      apiStateCharts: [],
      chartsOptions: [],
      chartsSeries: [],
      loading: true
    }
  },
  computed: {
    filteredApiState() {
      return this.apiState;
    }
  },
  async mounted() {
    const service = 'all';
    this.apiState = await this.getApiState(service);
    this.apiStateCharts = await this.getApiStateCharts(this.apiState);

    // Фейковые данные для тестов
    this.apiState = Faker().getApiState();
    this.apiStateCharts = Faker().getApiStateCharts(this.apiState);

    for (const chart of this.apiStateCharts) {
      this.chartsOptions.push(this.getChartOptions(chart));
      this.chartsSeries.push(this.getChartSeries(chart));
    }

    this.loading = false;
  },
  methods: {
    async getApiState(service) {
      const apiState = await fetch(`/endpoints/${service}`);
      if (apiState.ok) {
        this.apiState = await apiState.json();
      } else {
        this.apiState = [];
      }
    },
    async getApiStateCharts(apiState) {
      const apiStateCharts = [];
      for (const method in apiState) {
        const endpointId = method.id;
        const apiStateChart = await fetch(`/endpoint/${endpointId}`);
        if (apiStateChart.ok) {
          const apiStateChartJson = await apiStateChart.json();
          apiStateCharts.push(apiStateChartJson);
        } else {
          // Если сервер не вернул данные по заданному методу
          apiStateCharts.push({
            id: endpointId,
            name: method.name,
            events: null
          });
        }
      }
    },
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    },
    getChartSeries(chart) {
      const goodTime = [];
      const badTime = [];
      const events = chart.events;
      if (events.length > 0) {
        goodTime.push(events[0].success ? events[0].responseMS : null);
        badTime.push(events[0].success ? null : events[0].responseMS);
      }
      for (let i = 1; i < events.length; i++) {
        if (events[i].success) {
          goodTime.push(events[i].responseMS);
          badTime.push(null);
          if (!events[i - 1].success) {
            goodTime[i - 1] = events[i - 1].responseMS;
          }
        } else {
          badTime.push(events[i].responseMS);
          goodTime.push(null);
          if (events[i - 1].success) {
            badTime[i - 1] = events[i - 1].responseMS;
          }
        }
      }
      return [{
        name: 'Good',
        data: goodTime
      }, {
        name: 'Bad',
        data: badTime
      }];
    },
    getChartOptions(chart) {
      return {
        chart: {
          type: 'line',
          animations: {
            enabled: false
          }
        },
        colors: ['#00e396', '#ff0040'],
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        labels: chart.events.map(value => {
          return value.id
        }),
        xaxis: {
          tickAmount: 5
        },
      };
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

  ::v-deep .ant-tabs-bar {
    display: none;
  }

  .methods-list {
    .method {
      .method__body {
        display: flex;
        justify-content: space-between;
        padding: 15px 10px;

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
    grid-template-columns: repeat(auto-fit, minmax(280px, auto));
    gap: 20px;
    margin-top: 24px;
    justify-content: center;

    .method-card {
      .method-card__result {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      hr {
        margin: 12px 0;
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
