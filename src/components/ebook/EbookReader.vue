<template>
  <div class="ebook-reader">
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

  global.ePub = Epub
  export default {
    data () {
      return {}
    },
    mixins: [ebookMinx],
    methods: {
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
      hideTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', false)
        this.setMenuVisible(false)
        this.setFontFamilyVisible(false)
        this.setSettingVisible(-1)
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
            console.log('字体全部加载完成')
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
      initEpub () {
        const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRendition()
        this.initGesture()
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

</style>
