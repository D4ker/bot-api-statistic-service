<template>
  <div class="container">
    <div class="header__container">
      <div class="header__logo">
        <nuxt-link to="/">
<!--          <img src="~/assets/img/selectel-logo-header.svg" alt="Selectel">-->
        </nuxt-link>
      </div>
      <div class="header__contacts">
        <a class="header__phone" href="tel:88005550675">
          <p class="header__phone_text">8 800 555 06 75</p>
<!--          <img class="header__phone_icon" src="~/assets/img/phone.svg" alt="phone">-->
        </a>
        <a href="mailto:sales@selectel.ru">
          <p class="header__mail_text">sales@selectel.ru</p>
<!--          <img class="header__mail_icon" src="~/assets/img/mail.svg" alt="mail">-->
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

  .header__contacts {
    display: flex;

    a {
      color: $color-black;

      p {
        padding: 0;
      }
    }

    .header__phone {
      margin-right: 16px;

      .header__phone_text {
        margin-right: 32px;
      }
    }

    .header__phone_icon, .header__mail_icon {
      display: none;
      @media (max-width: $small-resolution) {
        display: block;
      }
    }

    .header__phone_text, .header__mail_text {
      display: block;
      @media (max-width: $small-resolution) {
        display: none;
      }
    }
  }
}
</style>
