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
    return methodsNames.map((value, index) => {
      return {
        id: index,
        name: value,
        avarageResponseMS: Math.round(Math.random() * 3000),
        successRate: Math.round(Math.random() * 100)
      }
    });
  }

  function getApiStateCharts(apiState) {
    return apiState.map(value => {
      const eventsSize = Math.round(Math.random() * 40);
      const events = [];
      for (let id = 0; id <= eventsSize; id++) {
        const success = !!Math.round(Math.random());
        const responseMS = Math.round(success ? Math.random() * 5000 : 5000 + Math.random() * 5000);
        events.push({
          id,
          success,
          responseMS
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
