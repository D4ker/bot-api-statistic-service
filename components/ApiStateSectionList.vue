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
      loading: true
    }
  },
  computed: {
    filteredApiState() {
      return this.apiState;
    }
  },
  async mounted() {
    const res = [
      {
        id: 0,
        name: 'users',
        successRate: 98.5,
        avarageResponseMS: 64
      },
      {
        id: 1,
        name: 'friends',
        avarageResponseMS: 56,
        successRate: 100
      },
      {
        id: 2,
        name: 'groups',
        avarageResponseMS: 70,
        successRate: 55
      },
      {
        id: 3,
        name: 'photos',
        avarageResponseMS: 45,
        successRate: 100
      },
      {
        id: 4,
        name: 'video',
        avarageResponseMS: 68,
        successRate: 100
      },
      {
        id: 5,
        name: 'messages',
        avarageResponseMS: 40,
        successRate: 20
      },
      {
        id: 6,
        name: 'wall',
        avarageResponseMS: 55,
        successRate: 64
      },
      {
        id: 7,
        name: 'newsfeed',
        avarageResponseMS: 67,
        successRate: 100
      },
      {
        id: 8,
        name: 'notes',
        avarageResponseMS: 80,
        successRate: 100
      },
      {
        id: 9,
        name: 'likes',
        avarageResponseMS: 34,
        successRate: 100
      },
      {
        id: 10,
        name: 'pages',
        avarageResponseMS: 52,
        successRate: 100
      },
      {
        id: 11,
        name: 'stars',
        avarageResponseMS: 42,
        successRate: 89
      },
      {
        id: 12,
        name: 'calls',
        avarageResponseMS: 35,
        successRate: 100
      },
      {
        id: 13,
        name: 'audios',
        avarageResponseMS: 124241188,
        successRate: 111
      },
      {
        id: 14,
        name: 'files',
        avarageResponseMS: 90,
        successRate: 30
      }
    ];
    const graphicsRes = {
      id: 0,
      name: "string",
      events: [
        {
          id: 0,
          success: true,
          responseMS: 102
        },
        {
          id: 1,
          success: true,
          responseMS: 130
        },
        {
          id: 2,
          success: true,
          responseMS: 115
        },
        {
          id: 3,
          success: true,
          responseMS: 120
        },
        {
          id: 4,
          success: true,
          responseMS: 160
        },
        {
          id: 5,
          success: true,
          responseMS: 300
        },
        {
          id: 6,
          success: true,
          responseMS: 115
        },
        {
          id: 7,
          success: true,
          responseMS: 100
        },
        {
          id: 8,
          success: false,
          responseMS: 100000
        },
        {
          id: 9,
          success: false,
          responseMS: 100000
        },
        {
          id: 10,
          success: false,
          responseMS: 100000
        },
        {
          id: 11,
          success: true,
          responseMS: 210
        },
        {
          id: 12,
          success: true,
          responseMS: 140
        }
      ]
    };
    this.apiState = res;
    this.loading = false;
  },
  methods: {
    cropNum(num) {
      const strNum = '' + num;
      return num >= 1e9 ? '∞' : num >= 1e6 ? `${strNum.slice(0, -6)}KK` : num >= 1e3 ? `${strNum.slice(0, -3)}K` : num
    }
  }
}
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
