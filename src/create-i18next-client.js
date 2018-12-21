import isNode from 'detect-node'
import i18next from 'i18next'
import i18nextXHRBackend from 'i18next-xhr-backend'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

const i18n = i18next.default ? i18next.default : i18next
i18n.nsFromReactTree = []

const isDomainLanValid = (domainLan) => {
  if (domainLan.length === 2) {
    return true
  }
  return false
}

const subdomain = {
  name: 'subdomain',
  lookup: (req) => {
    const hostnameArray = req.hostname.split('.')
    const isMobile = hostnameArray[1] === 'm'
    const domainLan = isMobile ? hostnameArray[2] : hostnameArray[1]
    if (isDomainLanValid(domainLan)) {
      return domainLan
    }
    return undefined
  },
}

export default (config) => {
  if (!i18n.isInitialized) {

    if (isNode) {
      const i18nextNodeBackend = eval("require('i18next-node-fs-backend')")
      const i18nextMiddleware = eval("require('i18next-express-middleware')")
      const lngDetector = new i18nextMiddleware.LanguageDetector()
      lngDetector.addDetector(subdomain)

      i18n.use(i18nextNodeBackend).use(lngDetector)
    } else {
      i18n.use(i18nextXHRBackend)
      if (config.browserLanguageDetection) {
        i18n.use(i18nextBrowserLanguageDetector)
      }
    }

    config.use.forEach(x => i18n.use(x))
    i18n.init(config)

  }
  return i18n
}
