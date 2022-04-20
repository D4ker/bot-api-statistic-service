<template>
  <div class="layout">
    <header class="header">
      <TheHeader/>
    </header>
    <main class="main">
      <nuxt/>
    </main>
    <footer class="footer">
      <TheFooter/>
    </footer>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';
export default {
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style lang="scss">
body {
  font-family: Manrope, sans-serif;
  font-weight: $font-medium;
}
.container {
  width: 100%;
  max-width: $container-width-max;
  margin: 0 auto;
}
</style>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .header {
    position: sticky;
    top: 0;
    z-index: 999;
    background-color: white;
  }
  .main {
    flex-grow: 1;
  }
  .footer {
    background-color: white;
  }
}
</style>
