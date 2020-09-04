import { mapActions, mapGetters } from 'vuex'
import { addCss, themeList, removeAllCss } from './book'
import { getReadTime, saveLocation } from './localStorage'

export const ebookMinx = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'currentBook',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section'
    ]),
    themeList () {
      return themeList(this)
    },
    getSectionName () {
      if (this.section) {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          return this.currentBook.navigation.get(sectionInfo.href).label
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setCurrentBook',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection'
    ]),
    initGlobalStyle () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      this.setSection(currentLocation.start.index)
      this.setProgress(Math.floor(progress * 100))
      saveLocation(this.fileName, startCfi)
    },
    display (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute(this.fileName))
    },
    getReadTimeByMinute (fileName) {
      const readTime = getReadTime(fileName)
      if (!readTime) {
        return 0
      } else {
        return Math.ceil(readTime / 60)
      }
    }
  }
}
