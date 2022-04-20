<template>
  <div class="container">
    <div class="header__container">
      <div class="header__name">
        <nuxt-link to="/">
          <h1>
            <span>Bot API Statistic Service</span>
          </h1>
        </nuxt-link>
      </div>
      <div class="header__contacts">
        <a href="mailto:bass@mail.ru">
          <p class="header__mail_text">bass@mail.ru</p>
          <img class="header__mail_icon" src="~/assets/img/mail.svg" alt="mail">
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header__container {
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  justify-content: space-between;
  width: $header-container-width;
  height: $header-height;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: $header-padding;
  @media (max-width: $small-resolution) {
    height: $header-height-mobile;
  }

  .header__name {
    h1 {
      color: $color-blue;
      margin: 0;

      @media (max-width: $small-resolution) {
        span {
          display: none;
        }

        &:after {
          content: 'BASS';
        }
      }
    }
  }

  .header__contacts {
    display: flex;

    a {
      color: $color-black;

      p {
        margin: 0;
      }
    }

    .header__mail_icon {
      display: none;
      @media (max-width: $small-resolution) {
        display: block;
      }
    }

    .header__mail_text {
      display: block;
      @media (max-width: $small-resolution) {
        display: none;
      }
    }
  }
}
</style>
