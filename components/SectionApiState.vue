<template>
  <div class="api-state__container container">
    <h2>Состояние API</h2>
    <p>В таблице ниже приведены категории методов, среднее время ответа на запрос и процент успешных ответов.</p>
    <div class="method" v-for="method in filteredApiState" :key="method">
      <div class="method__body">
        <p class="method__name">{{ method.name }}</p>
        <div class="method__result">
          <a-icon class="method__check" type="check-circle"/>
          <p class="method__time">{{ method.time }} мс</p>
          <p class="method__point">·</p>
          <p class="method__success">{{ method.success }}%</p>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    apiState: []
  }),
  computed: {
    filteredApiState() {
      return this.apiState;
    }
  },
  mounted() {
    const res = [
      {
        name: 'users',
        time: 64,
        success: 100
      },
      {
        name: 'friends',
        time: 56,
        success: 100
      },
      {
        name: 'groups',
        time: 70,
        success: 55
      },
      {
        name: 'photos',
        time: 45,
        success: 100
      },
      {
        name: 'video',
        time: 68,
        success: 100
      },
      {
        name: 'messages',
        time: 40,
        success: 20
      },
      {
        name: 'wall',
        time: 55,
        success: 64
      },
      {
        name: 'newsfeed',
        time: 67,
        success: 100
      },
      {
        name: 'notes',
        time: 80,
        success: 100
      },
      {
        name: 'likes',
        time: 34,
        success: 100
      },
      {
        name: 'pages',
        time: 52,
        success: 100
      }
    ];
    this.apiState = res;
  }
}
</script>

<style scoped lang="scss">
.api-state__container {
  max-width: 900px;

  p {
    color: black;
    margin: 0;
  }

  .method {
    .method__body {
      display: flex;
      justify-content: space-between;
      padding: 15px 10px;

      .method__result {
        display: grid;
        grid-template-columns: auto 1fr auto 1fr;
        align-items: center;
        column-gap: 5px;

        .method__check {
          color: #52c41a;
        }

        .method__success {
          justify-self: end;
          align-self: end;
          min-width: 20px;
          color: $color-gray;
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
