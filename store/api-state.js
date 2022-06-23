import Faker from '../modules/faker';

const Constants = require('../constants/constants');

export const state = () => ({
  apiState: []
})

export const mutations = {
  setApiState(state, apiState) {
    state.apiState = apiState;
  }
}

export const actions = {
  async getApiState({commit}) {
    // const apiState = await getApiState(Constants.service.ALL);

    // Фейковые данные для тестов
    const apiState = Faker().getApiState();
    for (const interval of Constants.chartsIntervals) {
      // const apiStateStatistics = await getApiStateStatistics(Constants.service.ALL, interval.frequency, interval.period);

      // Фейковые данные для тестов
      const apiStateStatistics = Faker().getApiStateStatistics(interval.frequency, interval.period);

      apiState.forEach(method => {
        const statistics = apiStateStatistics[method.id].statistics;
        method.chartsSeries[interval.period] = getChartSeries(statistics);
        method.chartsOptions[interval.period] = getChartOptions(statistics);
      });
    }

    commit('setApiState', apiState);
  }
}

export const getters = {
  apiState: state => state.apiState
}

async function getApiState(service) {
  const apiState = await fetch(`${Constants.serverUrl}/endpoints/${service}/summary`);
  if (apiState.ok) {
    const apiStateJson = await apiState.json();
    apiStateJson.forEach(method => {
      method.fullname = method.name + ': ' + method.method;
      method.chartsSeries = [];
      method.chartsOptions = {};
    });
    return apiStateJson;
  } else {
    return {};
  }
}

async function getApiStateStatistics(service, frequency, period) {
  const apiStateStatistics = await fetch(`${Constants.serverUrl}/endpoints/${service}?frequency=${frequency}&period=${period}`);
  if (apiStateStatistics.ok) {
    const apiStateStatisticsJson = await apiStateStatistics.json();
    const apiStateStatisticsObj = {};
    apiStateStatisticsJson.forEach(method => {
      apiStateStatisticsObj[method.id] = method;
    });
    return apiStateStatisticsObj;
  } else {
    return [];
  }
}

function getChartSeries(statistics) {
  const goodTime = [];
  const badTime = [];
  const badTimeConst = 0;
  if (statistics.length > 0) {
    goodTime.push(statistics[0].averageResponseMS === null || statistics[0].successRate < 0.6 ? null : statistics[0].averageResponseMS);
    badTime.push(statistics[0].averageResponseMS !== null && statistics[0].successRate >= 0.6 ? null : badTimeConst);
  }
  for (let i = 1; i < statistics.length; i++) {
    if (statistics[i].averageResponseMS !== null && statistics[i].successRate >= 0.6) {
      goodTime.push(statistics[i].averageResponseMS);
      badTime.push(null);
      if (statistics[i - 1].averageResponseMS === null || statistics[i - 1].successRate < 0.6) {
        goodTime[i - 1] = badTimeConst;
      }
    } else {
      badTime.push(badTimeConst);
      goodTime.push(null);
      if (statistics[i - 1].averageResponseMS !== null && statistics[i - 1].successRate >= 0.6) {
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

function getChartOptions(statistics) {
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
    markers: {
      //size: [0, 3],
      showNullDataPoints: true
    },
    colors: ['#00e396', '#ff0040'],
    xaxis: {
      type: 'datetime',
      categories: statistics.map(point => {
        const date = new Date(point.bindPoint * 1000);
        return date.toISOString();
      })
    },
    yaxis: {
      min: 0,
      decimalsInFloat: 0,
      forceNiceScale: true
    },
  };
}
