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
                <p class="method__name">{{ method.name }}: {{ method.method }}</p>
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
                    :title="`${method.name}: ${method.method}`">
              <div class="method-card__body">
                <div class="method-card__result">
                  <a-icon class="method__check" type="check-circle"/>
                  <p class="method__time">{{ cropNum(method.averageResponseMS) }} мс</p>
                  <p class="method__success">{{ cropNum(method.successRate) }}%</p>
                </div>
                <hr>
                <div class="method__chart">
                  <apexchart type="area" height="100%" :options="chartsOptions[method.id]"
                             :series="chartsSeries[method.id]"></apexchart>
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
      if (this.methodsSortFilter === 'name') {
        return this.apiState.sort((m1, m2) => {
          const name1 = m1.name.toLowerCase();
          const name2 = m2.name.toLowerCase();
          return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
        });
      } else if (this.methodsSortFilter === 'time') {
        return this.apiState.sort((m1, m2) => {
          return m2.averageResponseMS - m1.averageResponseMS;
        });
      } else if (this.methodsSortFilter === 'success') {
        return this.apiState.sort((m1, m2) => {
          return m1.successRate - m2.successRate;
        });
      }
      return this.apiState;
    }
  },
  async mounted() {
    const service = 'all';
    const offset = 0;
    const length = 100;
    this.apiState = await this.getApiState(service);
    this.apiStateCharts = await this.getApiStateCharts(this.apiState, offset, length);

    // Фейковые данные для тестов
    this.apiState = Faker().getApiState();
    this.apiStateCharts = Faker().getApiStateCharts(this.apiState, length);

    for (const chart of this.apiStateCharts) {
      this.chartsOptions[chart.id] = this.getChartOptions(chart);
      this.chartsSeries[chart.id] = this.getChartSeries(chart);
    }

    this.loading = false;
  },
  methods: {
    async getApiState(service) {
      const apiState = await fetch(`/api/endpoints/${service}`);
      if (apiState.ok) {
        return await apiState.json();
      } else {
        return [];
      }
    },
    async getApiStateCharts(apiState, offset, length) {
      const apiStateCharts = [];
      for (const method of apiState) {
        const endpointId = method.id;
        const apiStateChart = await fetch(`/api/endpoint/${endpointId}?offset=${offset}&length=${length}`);
        if (apiStateChart.ok) {
          const apiStateChartJson = await apiStateChart.json();
          apiStateChartJson.events.sort((ev1, ev2) => {
            return ev1.requestTime - ev2.requestTime;
          });
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

      return apiStateCharts;
    },
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    },
    getChartSeries(chart) {
      const goodTime = [];
      const badTime = [];
      const events = chart.events;
      const badTimeConst = 0;
      if (events.length > 0) {
        goodTime.push(events[0].success ? events[0].responseMS : null);
        badTime.push(events[0].success ? null : badTimeConst);
      }
      for (let i = 1; i < events.length; i++) {
        if (events[i].success) {
          goodTime.push(events[i].responseMS);
          badTime.push(null);
          if (!events[i - 1].success) {
            goodTime[i - 1] = badTimeConst;
          }
        } else {
          badTime.push(badTimeConst);
          goodTime.push(null);
          if (events[i - 1].success) {
            goodTime[i] = badTimeConst;
          }
        }
      }
      return [{
        name: '',
        data: goodTime
      }, {
        name: '',
        data: badTime
      }];
    },
    getChartOptions(chart) {
      let yMax = Math.max(...chart.events.map(event => {
        return event.responseMS;
      }));
      yMax = yMax < 500 ? 500 : yMax;
      return {
        chart: {
          type: 'area',
          height: 250,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          animations: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        stroke: {
          width: 2
        },
        tooltip: {
          custom: function ({series, dataPointIndex}) {
            let goodTimeValue = series[0][dataPointIndex];
            let badTimeValue = series[1][dataPointIndex];
            goodTimeValue = goodTimeValue > 0 ? goodTimeValue : '';
            badTimeValue = badTimeValue === 0 ? badTimeValue : '';
            return '<div class="arrow_box">' +
              '<span>' + goodTimeValue + '</span>' +
              '<div></div>' +
              '<span>' + badTimeValue + '</span>' +
              '</div>'
          },
          theme: 'dark',
          x: {
            format: 'dd-MM-yy HH:mm:ss'
          }
        },
        colors: ['#00e396', '#ff0040'],
        xaxis: {
          type: 'datetime',
          categories: chart.events.map(value => {
            const date = new Date(value.requestTime);
            return date.toISOString();
          })
        },
        yaxis: {
          max: yMax,
          forceNiceScale: true
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
