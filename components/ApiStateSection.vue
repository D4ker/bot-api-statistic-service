<template>
  <div>
    <div class="api-state__container container">
      <h2>Состояние API</h2>
      <p>В таблице ниже приведены категории методов, среднее время ответа на запрос и процент успешных ответов.</p>
    </div>
    <ApiStateSectionFilter/>
    <div class="api-state__container container">
      <ApiStateSectionList/>
    </div>
  </div>
</template>

<script>
import ApiStateSectionFilter from './ApiStateSectionFilter';
import ApiStateSectionList from "./ApiStateSectionList";

export default {
  components: {
    ApiStateSectionFilter,
    ApiStateSectionList
  }
}
</script>

<style scoped lang="scss">
.api-state__container {
  max-width: $api-state-width;
  padding: 0 10px;

  p {
    color: black;
    margin: 0;
  }
}
</style>
