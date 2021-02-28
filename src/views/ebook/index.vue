<template>
    <div class="ebook" ref="ebook">
      <ebook-book-mark></ebook-book-mark>
      <ebook-reader></ebook-reader>
      <ebook-title></ebook-title>
      <ebook-menu></ebook-menu>
    </div>
</template>

<script type="text/ecmascript-6">
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import { saveReadTime, getReadTime } from '../../utils/localStorage'
  import { ebookMinx } from '../../utils/mixin'
  import EbookBookMark from '../../components/ebook/EbookBookMark'

  export default {
      mixins: [ebookMinx],
      components: {
        EbookBookMark,
        EbookReader,
        EbookTitle,
        EbookMenu
      },
      watch: {
        offsetY (v) {
          if (!this.menuVisible && this.bookAvailable) {
            if (v > 0) {
              this.move(v)
            } else if (v === 0) {
              this.restore()
            }
          }
        }
      },
      methods: {
        restore () {
          this.$refs.ebook.style.top = 0
          this.$refs.ebook.style.transition = 'all .2s linear'
          setTimeout(() => {
            this.$refs.ebook.style.transition = ''
          }, 200)
        },
        move (v) {
          this.$refs.ebook.style.top = v + 'px'
        },
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
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
