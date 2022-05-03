<template>
  <div class="api-state__container container">
    <h2>Состояние API</h2>
    <p>В таблице ниже приведены категории методов, среднее время ответа на запрос и процент успешных ответов.</p>
    <div class="api-state__loader" v-if="loading">
      <SectionApiStateLoader/>
    </div>
    <div v-else class="method" v-for="method in filteredApiState" :key="method.id">
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
</template>

<script>
import SectionApiStateLoader from '@/components/SectionApiStateLoader';

export default {
  components: {
    SectionApiStateLoader
  },
  data: () => ({
    apiState: [],
    loading: true
  }),
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
.api-state__container {
  max-width: 900px;
  padding: 0 10px;

  p {
    color: black;
    margin: 0;
  }

  .api-state__loader {
    display: flex;
    justify-content: center;
  }

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

        .method__check {
          color: #52c41a;
        }

        .method__time {
          justify-self: end;
        }

        .method__success {
          justify-self: end;
          color: $color-gray-light;
        }
      }
    }

    hr {
      border: 0;
      margin: 0;
      border-top: 1px solid #ccc;
    }
  }
}
</style>
