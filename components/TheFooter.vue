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
        <nuxt-link to="/">tamtambotapistats.ru</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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
    flex-grow: 1;

    @media (max-width: $small-resolution) {
      min-width: 100%;
      order: -1;
    }

    .footer__nav-container {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin: 0;
      padding-left: 40px;
      list-style: none;

      @media (max-width: $small-resolution) {
        padding: 0;
      }

      .footer__nav-item {
        margin-right: 40px;
      }
    }
  }
}
</style>
