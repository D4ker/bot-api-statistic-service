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
    let index = 0;
    for (const methodName of methodsNames) {
      for (const restMethod of restMethods) {
        apiState.push({
          id: index,
          name: methodName,
          averageResponseMS: Math.round(Math.random() * 3000),
          successRate: Math.round(Math.random() * 100),
          method: restMethod
        });
        index++;
      }
    }
    return apiState;
  }

  function getApiStateCharts(apiState, length) {
    return apiState.map(value => {
      const eventsSize = Math.round(Math.random() * length);
      const events = [];
      for (let id = 0; id <= eventsSize; id++) {
        const success = events.length > 0 && !events[id - 1].success ? Math.random() < 0.3 : Math.random() < 0.9;
        const responseMS = !success ? null : Math.random() > 0.98 ? Math.round(Math.random() * 3000) : Math.round(Math.random() * 300);
        const responseCode = Math.round(success ? 200 + Math.random() * 100 : 300 + Math.random() * 300);
        const requestTime = new Date('2016-07-25').getTime() + id * 1000;
        events.push({
          id,
          success,
          responseMS,
          responseCode,
          requestTime
        });
      }
      value.events = events;
      return value;
    });
  }

  return {
    getApiState,
    getApiStateCharts
  };
}
