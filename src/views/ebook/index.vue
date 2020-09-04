<template>
    <div class="ebook">
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
    </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import { saveReadTime, getReadTime } from '../../utils/localStorage'
  import { ebookMinx } from '../../utils/mixin'

  export default {
    mixins: [ebookMinx],
      components: {
        EbookReader,
        EbookTitle,
        EbookMenu
      },
      methods: {
        startLoopReadTime () {
          let readTime = getReadTime(this.fileName)
          // 第一次阅读
          if (!readTime) {
            readTime = 0
          }
          this.task = setInterval(() => {
            readTime++
            // 半分钟记录一次
            if (readTime % 30 === 0) {
              saveReadTime(this.fileName, readTime)
            }
          }, 1000)
        }
      },
      mounted () {
        this.startLoopReadTime()
      },
      beforeDestroy () {
        if (this.task) {
          clearInterval(this.task)
        }
      }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global.scss";
</style>
