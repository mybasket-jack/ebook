<template>
  <div class="ebook-bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper">
      <span class="icon"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EbookBookMark',
    data () {
      return {
        text: this.$t('book.pulldownAddMark')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet" scoped>
  @import "../../assets/styles/global";
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-left: px2rem(15);
    }
  }
</style>
