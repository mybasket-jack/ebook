<template>
  <div class="ebook-reader">
    <div class="ebook-reader-mask"
          @click="onMaskClick"
          @touchmove="move"
          @touchend="moveEnd"></div>
    <div id="read"></div>
  </div>
</template>
<script>
  import Epub from 'epubjs'
  import { ebookMinx } from '../../utils/mixin'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
  } from '../../utils/localStorage'
  import { flatten } from '../../utils/book'

  global.ePub = Epub
  export default {
    data () {
      return {
        firstOffsetY: null
      }
    },
    mixins: [ebookMinx],
    methods: {
      move (e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        e.stopPropagation()
      },
      moveEnd (e) {
        this.setOffsetY(0)
        this.firstOffsetY = null
      },
      onMaskClick (e) {
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      prevPage () {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu () {
        if (this.menuVisible) {
          this.setFontFamilyVisible(false)
          this.setSettingVisible(-1)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      initFontSize () {
        // 设置字体大小
        const fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize + 'px')
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily () {
        // 设置字体
        const font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initTheme () {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initRendition () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          methods: 'default'
        })
        const location = getLocation(this.fileName)
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        this.rendition.hooks.content.register(contents => {
          Promise.all(
            [
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
            ]
          ).then(() => {
            // console.log('字体全部加载完成')
          })
        })
      },
      initGesture () {
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        }, { passive: false })
        this.rendition.on('touchend', event => {
          const offsetX = event.changedTouches[0].clientX -
            this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
/*          event.preventDefault()
          event.stopPropagation() */
        }, { passive: false })
      },
      parseBook () {
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc)
          function find (item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      initEpub () {
        const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRendition()
        this.initGesture()
        this.parseBook()
        // 分页
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) *
            (getFontSize(this.fileName) / 16))
        }).then(locations => {
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      }
    },
    mounted () {
      const books = this.$route.params.fileName.split('|')
      this.setFileName(books.join('/')).then(() => {
        this.initEpub()
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/styles/global';
  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      z-index: 150;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
