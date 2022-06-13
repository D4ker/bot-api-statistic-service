// Модуль генерации фейковых данных для тестов
export default function Faker() {
  function getApiState(frequency, period) {
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
        const successRate = Math.round(Math.random() * 100);
        const averageResponseMS = Math.random() > 0.98 ? Math.round(Math.random() * 3000) : Math.round(Math.random() * 300);
        const statistics = getApiStateCharts(apiState, frequency, period);
        apiState.push({
          id,
          name,
          successRate,
          averageResponseMS,
          statistics,
          method
        });
        id++;
      }
    }
    return apiState;
  }

  function getApiStateCharts(apiState, frequency, period) {
    const pointsCount = frequency * period;
    const statistics = [];
    for (let id = 0; id <= pointsCount; id++) {
      const success = statistics.length > 0 && statistics[id - 1].averageResponseMS === null ? Math.random() < 0.3 : Math.random() < 0.9;
      const successRate = !success ? null : Math.round(Math.random() * 100);
      const averageResponseMS = !success ? null : Math.random() > 0.98 ? Math.round(Math.random() * 3000) : Math.round(Math.random() * 300);
      const bindPoint = new Date().setHours(0, 0, 0, 0) - (pointsCount - id) * 1000 * 60 * 60 * 24 / frequency;
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
    getApiStateCharts
  };
}
