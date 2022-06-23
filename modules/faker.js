// Модуль генерации фейковых данных для тестов
export default function Faker() {
  function getApiState() {
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
    const restMethods = [
      'GET',
      'POST',
      'DELETE',
      'UPDATE'
    ];
    const apiState = [];
    let id = 0;
    for (const name of methodsNames) {
      for (const method of restMethods) {
        const fullname = name + ': ' + method;
        const successRate = Math.round(Math.random() * 100);
        const averageResponseMS = Math.random() > 0.98 ? Math.round(Math.random() * 3000) : Math.round(Math.random() * 300);
        apiState.push({
          id,
          name,
          fullname,
          chartsSeries: [],
          chartsOptions: {},
          successRate,
          averageResponseMS,
          method
        });
        id++;
      }
    }
    return apiState;
  }

  function getApiStateStatistics(frequency, period) {
    const apiStateStatistics = getApiState();

    const apiStateStatisticsObj = {};
    apiStateStatistics.forEach(method => {
      apiStateStatisticsObj[method.id] = method;
      apiStateStatisticsObj[method.id].statistics = getApiStateCharts(frequency, period);
    });

    return apiStateStatisticsObj;
  }

  function getApiStateCharts(frequency, period) {
    const pointsCount = frequency * period;
    const statistics = [];
    for (let id = 0; id <= pointsCount; id++) {
      const successRate = Math.floor(Math.random() * 101) / 100;
      const averageResponseMS = successRate < 0.6 ? 0 : Math.random() > 0.98 ? Math.round(Math.random() * 3000) : Math.round(Math.random() * 300);
      const bindPoint = new Date().setHours(0, 0, 0, 0) / 1000 - (pointsCount - id) * 60 * 60 * 24 / frequency;
      statistics.push({
        successRate,
        averageResponseMS,
        bindPoint
      });
    }
    return statistics;
  }

  return {
    getApiState,
    getApiStateStatistics
  };
}
