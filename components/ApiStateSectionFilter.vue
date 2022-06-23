<template>
  <div class="api-state-filter">
    <div class="api-state-filter__container container">
      <div class="api-state-filter__select">
        <div class="api-state-filter__sort">
          Сортировать
          <a-select
            placeholder="Сортировать"
            style="width: 100%"
            v-model="sortFilter"
            :getPopupContainer="triggerNode => triggerNode.parentElement"
            @change="handleChangeSort">
            <a-select-option value="name">По названию</a-select-option>
            <a-select-option value="time">По времени</a-select-option>
            <a-select-option value="success">По процентам</a-select-option>
          </a-select>
        </div>
        <div class="api-state-filter__period">
          Период
          <a-select
            placeholder="Период"
            style="width: 100%"
            v-model="periodFilter"
            :getPopupContainer="triggerNode => triggerNode.parentElement"
            @change="handleChangePeriod">
            <a-select-option value="7-days">7 дней</a-select-option>
            <a-select-option value="30-days">30 дней</a-select-option>
          </a-select>
        </div>
      </div>
      <a-radio-group
        class="api-state-filter__view-mode"
        v-model="viewModeFilter"
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
  data() {
    return {
      sortFilter: 'name',
      periodFilter: '7-days',
      viewModeFilter: 'list'
    }
  },
  mounted() {
    this.handleChangeSort(this.sortFilter);
    this.handleChangePeriod(this.periodFilter);
    this.sendViewMode(this.viewModeFilter);
  },
  methods: {
    handleChangeSort(value) {
      this.$emit('methodsSortFilter', value);
    },
    handleChangePeriod(value) {
      this.$emit('methodsPeriodFilter', value);
    },
    onChangeViewMode(values) {
      this.sendViewMode(values.target.value);
    },
    sendViewMode(value) {
      this.$emit('viewModeFilter', value);
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
    padding: 10px 10px;

    .api-state-filter__select {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .api-state-filter__sort {
        width: 200px;
        margin-right: 20px;
      }

      .api-state-filter__period {
        width: 200px;
        margin-right: 20px;
      }
    }

    .api-state-filter__view-mode {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      max-width: 103px;
      width: 100%;
      font-size: 20px;

      @media (max-width: 563px) {
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
      }

      ::v-deep .ant-radio-button-wrapper {
        width: 51px;
        border-radius: unset;
      }
    }
  }
}
</style>
