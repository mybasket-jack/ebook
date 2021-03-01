<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :height="35" :width="15"/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bookmark from '../common/Bookmark'
  import { realPx } from '../../utils/utils'
  import { ebookMinx } from '../../utils/mixin'
  import { saveBookMark, getBookMark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'
  export default {
    name: 'EbookBookMark',
    mixins: [ebookMinx],
    components: { Bookmark },
    computed: {
      height () {
        return realPx(35)
      },
      threshold () {
        return realPx(55)
      },
      fixedStyle () {
        return {
          position: 'fixed',
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`,
          top: 0
        }
      }
    },
    watch: {
      offsetY (v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        if (v >= this.height && v <= this.threshold) {
         this.beforeThreshold(v)
        } else if (v >= this.threshold) {
         this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          this.beforeHeight()
        } else if (v === 0) {
          this.reStore()
        }
      },
      isBookmark (v) {
        this.isFixed = v
        if (v) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    data () {
      return {
        text: '',
        color: WHITE,
        isFixed: false
      }
    },
    methods: {
      addBookmark () {
        let bookmark = getBookMark(this.fileName)
        if (!bookmark) {
          bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfiBase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`
        const cfi = currentLocation.start.cfi
        this.currentBook.getRange(cfiRange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          bookmark.push({
            cfi: cfi,
            text: text
          })
          this.setIsBookmark(true)
          saveBookMark(this.fileName, bookmark)
        })
      },
      removeBookmark () {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookMark(this.fileName)
        if (this.bookmark) {
          saveBookMark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        }
        this.setIsBookmark(false)
      },
      reStore () {
        // 状态4：恢复初始状态， 归为
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      beforeHeight () {
        // 状态1： 未超过书签高度
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold (v) {
        // 状态2： 未到达零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold (v) {
        // 状态3： 超越零界状态
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
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
      margin-right: px2rem(15);
    }
  }
</style>
