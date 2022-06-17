import Faker from '../modules/faker';

const Constants = require('../constants/constants');

export const state = () => ({
  apiState: {}
})

export const mutations = {
  setApiState(state, apiState) {
    state.apiState = apiState;
  }
}

export const actions = {
  async getApiState({commit}) {
    const apiState = {};
    const apiStateSummary = await getApiStateSummary(Constants.service.ALL);

    for (const interval of Constants.chartsIntervals) {
      apiState[interval.period] = await getApiState(Constants.service.ALL, interval.frequency, interval.period);

      // Фейковые данные для тестов
      //  apiState[interval.period] = Faker().getApiState(interval.frequency, interval.period);

      apiState[interval.period].forEach(method => {
        method.fullname = method.name + ': ' + method.method;
        method.successRate = apiStateSummary[method.id].successRate;
        method.averageResponseMS = apiStateSummary[method.id].averageResponseMS;

        method.chartsOptions = getChartOptions(method);
        method.chartsSeries = getChartSeries(method);
      });
    }

    commit('setApiState', apiState);
  }
}

export const getters = {
  apiState: state => state.apiState
}

async function getApiStateSummary(service) {
  const apiStateSummary = await fetch(`${Constants.serverUrl}/endpoints/${service}/summary`);
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
}

async function getApiState(service, frequency, period) {
  const apiStateCharts = await fetch(`${Constants.serverUrl}/endpoints/${service}?frequency=${frequency}&period=${period}`);
  if (apiStateCharts.ok) {
    return await apiStateCharts.json();
  } else {
    return [];
  }
}

function getChartSeries(chart) {
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
}

function getChartOptions(chart) {
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
