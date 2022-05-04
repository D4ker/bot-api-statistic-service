<template>
  <div>
    <div class="api-state__container container">
      <h2>Состояние API</h2>
      <p>В таблице ниже приведены категории методов, среднее время ответа на запрос и процент успешных ответов.</p>
    </div>
    <ApiStateSectionFilter
      @methodsSortFilter="(recMethodsSortFilter) => this.methodsSortFilter = recMethodsSortFilter"
      @viewModeFilter="(recViewModeFilter) => this.viewModeFilter = recViewModeFilter"/>
    <div class="api-state__container container">
      <ApiStateSectionList
        :methodsSortFilter="methodsSortFilter"
        :viewModeFilter="viewModeFilter"/>
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
  },
  data() {
    return {
      methodsSortFilter: '',
      viewModeFilter: ''
    }
  },
}
</script>

<style scoped lang="scss">
.api-state__container {
  max-width: $api-state-width;
  padding: 0 10px;
}
</style>
