<template>
  <div>
    <div v-if="loading" class="api-state__loader">
      <ApiStateSectionListLoader/>
    </div>
    <div v-else class="methods-container">
      <div v-if="viewModeFilter === 'list' || viewModeFilter === ''" class="methods-list">
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
      <div v-else class="methods-cards">
        <a-card class="method-card" v-for="method in filteredApiState" :key="method.id" :title="method.name">
          <div class="method-card__body">
            <div class="method-card__result">
              <a-icon class="method__check" type="check-circle"/>
              <p class="method__time">{{ cropNum(method.avarageResponseMS) }} мс</p>
              <p class="method__success">{{ cropNum(method.successRate) }}%</p>
            </div>
            <hr>
            <apexchart type="line" height="250" :options="getChartOptions(method.id)"
                       :series="getChartSeries(method.id)"></apexchart>
          </div>
        </a-card>
      </div>
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
      loading: true
    }
  },
  computed: {
    filteredApiState() {
      return this.apiState;
    }
  },
  async mounted() {
    const methodsNames = [
      'users',
      'friends',
      'groups',
      'photos',
      'video',
      'messages',
      'wall',
      'newsfeed',
      'notes',
      'likes',
      'pages',
      'stars',
      'calls',
      'audios',
      'files'
    ];
    const apiState = methodsNames.map((value, index) => {
      return {
        id: index,
        name: value,
        avarageResponseMS: Math.round(Math.random() * 3000),
        successRate: Math.round(Math.random() * 100)
      }
    });

    const apiStateCharts = apiState.map(value => {
      const eventsSize = Math.round(Math.random() * 40);
      const events = [];
      for (let id = 0; id <= eventsSize; id++) {
        const success = !!Math.round(Math.random());
        const responseMS = Math.round(success ? Math.random() * 5000 : 5000 + Math.random() * 5000);
        events.push({
          id,
          success,
          responseMS
        });
      }
      value.events = events;
      return value;
    });
    this.apiState = apiState;
    this.apiStateCharts = apiStateCharts;
    this.loading = false;
  },
  methods: {
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    },
    getChartSeries(id) {
      const goodTime = [];
      const badTime = [];
      const events = this.apiStateCharts[id].events;
      if (events.length > 0) {
        goodTime.push(events[0].success ? events[0].responseMS : null);
        badTime.push(events[0].success ? null : events[0].responseMS);
      }
      for (let i = 1; i < events.length; i++) {
        if (events[i].success) {
          goodTime.push(events[i].responseMS);
          badTime.push(events[i - 1].success ? null : events[i].responseMS);
        } else {
          badTime.push(events[i].responseMS);
          goodTime.push(events[i - 1].success ? events[i].responseMS : null);
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
    getChartOptions(id) {
      return {
        chart: {
          type: 'line',
          animations: {
            enabled: false
          }
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        labels: this.apiStateCharts[id].events.map(value => {
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
