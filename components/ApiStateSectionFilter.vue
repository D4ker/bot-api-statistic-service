<template>
  <div class="api-state-filter">
    <div class="api-state-filter__container container">
      <div class="api-state-filter__sort">
        <a-select
          placeholder="Сортировать"
          style="width: 200px"
          :getPopupContainer="triggerNode => triggerNode.parentElement"
          @change="handleChangeSort">
          <a-select-option value="name">По названию</a-select-option>
          <a-select-option value="time">По времени</a-select-option>
          <a-select-option value="success">По процентам</a-select-option>
        </a-select>
      </div>
      <a-radio-group
        class="api-state-filter__view-mode"
        default-value="list"
        @change="onChangeViewMode">
        <a-radio-button value="list">
          <a-icon type="menu"/>
        </a-radio-button>
        <a-radio-button value="cards">
          <a-icon type="appstore"/>
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleChangeSort(value) {
      this.$emit('methodsSortFilter', value);
    },
    onChangeViewMode(values) {
      this.$emit('viewModeFilter', values.target.value);
    }
  }
}
</script>

<style scoped lang="scss">
.api-state-filter {
  position: sticky;
  top: $header-height;
  z-index: 111;
  display: flex;
  align-items: center;
  font-weight: $font-regular;
  min-height: $api-state-filter-height;
  background-color: white;

  @media (max-width: $small-resolution) {
    top: $header-height-mobile;
  }

  .api-state-filter__container {
    display: flex;
    justify-content: space-between;
    max-width: $api-state-width;
    padding: 0 10px;

    .api-state-filter__view-mode {
      font-size: 20px;
    }
  }
}
</style>
