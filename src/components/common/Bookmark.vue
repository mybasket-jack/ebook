<template>
  <div class="bookmark"></div>
</template>

<script>
  export default {
    name: 'Bookmark'
  }
</script>

<style lang="scss" rel="stylesheet" scoped>
  @import "../../assets/styles/global";
  .bookmark {
    width: 0;
    height: 0;
    border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
    border-style: solid;
    border-color: white white transparent white;
  }
</style>
