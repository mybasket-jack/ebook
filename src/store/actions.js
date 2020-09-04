const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILE_NAME', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('SET_MENU_VISIBLE', menuVisible)
  },
  setSettingVisible: ({ commit }, menuVisible) => {
    return commit('SET_SETTING_VISIBLE', menuVisible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
  },
  setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
    return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
  },
  setCurrentBook: ({ commit }, currentBook) => {
    return commit('SET_CURRENT_BOOK', currentBook)
  },
  setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
  },
  setDefaultTheme: ({ commit }, defaultTheme) => {
    return commit('SET_DEFAULT_THEME', defaultTheme)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  }
}
export default actions
