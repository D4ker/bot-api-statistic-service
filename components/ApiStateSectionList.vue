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
                <div class="method__chart">
                  <apexchart type="area" height="100%" :options="chartsOptions[period][method.id]"
                             :series="chartsSeries[period][method.id]"></apexchart>
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
      apiState: {},
      chartsOptions: {},
      chartsSeries: {},
      period: 0,
      loading: true
    }
  },
  computed: {
    filteredApiState() {
      if (this.methodsPeriodFilter === '7-days') {
        this.period = 7;
      } else if (this.methodsPeriodFilter === '30-days') {
        this.period = 30;
      }
      const currentApiState = this.apiState[this.period];
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
    const service = 'all';
    const chartsIntervals = [
      {
        // frequency: 4,
        frequency: 650, // Временный костыль
        period: 7
      }, {
        // frequency: 1,
        frequency: 700, // Временный костыль
        period: 30
      }
    ];

    const apiStateSummary = await this.getApiStateSummary(service);
    for (const interval of chartsIntervals) {
      this.apiState[interval.period] = await this.getApiState(service, interval.frequency, interval.period);

      this.apiState[interval.period].forEach(method => {
        method.fullname = method.name + ': ' + method.method;
        method.successRate = apiStateSummary[method.id].successRate;
        method.averageResponseMS = apiStateSummary[method.id].averageResponseMS;
        method.statistics = method.statistic; // Временный костыль
        method.statistics.map(point => point.averageResponseMS = point.averageResponseMs); // Временный костыль
      });

      // Фейковые данные для тестов
      // this.apiState[interval.period] = Faker().getApiState(interval.frequency, interval.period);

      this.chartsOptions[interval.period] = {};
      this.chartsSeries[interval.period] = {};
      for (const method of this.apiState[interval.period]) {
        this.chartsOptions[interval.period][method.id] = this.getChartOptions(method);
        this.chartsSeries[interval.period][method.id] = this.getChartSeries(method);
      }
    }

    this.loading = false;
  },
  methods: {
    async getApiStateSummary(service) {
      const apiStateSummary = await fetch(`/api/endpoints/${service}/summary`);
      if (apiStateSummary.ok) {
        const apiStateSummaryJson = await apiStateSummary.json();
        const apiStateSummaryObj = {};
        for (const method of apiStateSummaryJson) {
          apiStateSummaryObj[method.id] = {};
          apiStateSummaryObj[method.id].successRate = method.successRate;
          apiStateSummaryObj[method.id].averageResponseMS = method.averageResponseMS;
        }
        return apiStateSummaryObj;
      } else {
        return {};
      }
    },
    async getApiState(service, frequency, period) {
      const apiStateCharts = await fetch(`/api/endpoints/${service}?frequency=${frequency}&period=${period}`);
      if (apiStateCharts.ok) {
        return await apiStateCharts.json();
      } else {
        return [];
      }
    },
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    },
    getChartSeries(chart) {
      const goodTime = [];
      const badTime = [];
      const statistics = chart.statistics;
      const badTimeConst = 0;
      if (statistics.length > 0) {
        goodTime.push(statistics[0].averageResponseMS);
        badTime.push(statistics[0].averageResponseMS !== null ? null : badTimeConst);
      }
      for (let i = 1; i < statistics.length; i++) {
        if (statistics[i].averageResponseMS !== null) {
          goodTime.push(statistics[i].averageResponseMS);
          badTime.push(null);
          if (statistics[i - 1].averageResponseMS === null) {
            goodTime[i - 1] = badTimeConst;
          }
        } else {
          badTime.push(badTimeConst);
          goodTime.push(null);
          if (statistics[i - 1].averageResponseMS !== null) {
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
      let yMax = Math.max(...chart.statistics.map(point => {
        return point.averageResponseMS;
      }));
      yMax = yMax < 500 ? 500 : yMax + 500 - yMax % 500;
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
          enabled: false
        },
        colors: ['#00e396', '#ff0040'],
        xaxis: {
          type: 'datetime',
          categories: chart.statistics.map(point => {
            const date = new Date(point.bindPoint * 1000);
            return date.toISOString();
          })
        },
        yaxis: {
          min: 0,
          max: yMax,
          decimalsInFloat: 0,
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
