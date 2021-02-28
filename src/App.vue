<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
  export default {}
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>
<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: none;
    background: #7d8188;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    position: fixed;
  }
</style>
