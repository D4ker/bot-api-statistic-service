<template>
  <div class="container">
    <div class="footer__container">
      <div class="footer__copyright">© 2022 BASS Team</div>
      <nav class="footer__nav">
        <ul class="footer__nav-container">
          <li class="footer__nav-item">
            <nuxt-link to="/support">Поддержка</nuxt-link>
          </li>
          <li class="footer__nav-item">
            <nuxt-link to="/rules">Правила</nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="footer__logo-text">
        <nuxt-link to="/">bass.ru</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheFooter"
}
</script>

<style scoped lang="scss">
.footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $footer-height;
  padding: $footer-padding;

  a {
    color: $color-gray-light;

    &:hover {
      color: black;
    }
  }

  .footer__copyright {
    color: black;
  }

  .footer__nav {
    display: flex;
    justify-content: flex-start;
    flex-grow: 1;

    .footer__nav-container {
      display: flex;
      justify-content: space-evenly;
      margin: 0;
      padding: 0;
      list-style: none;

      .footer__nav-item {
        margin-left: 40px;
      }
    }
  }
}
</style>
