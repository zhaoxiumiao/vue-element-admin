import defaultSettings from '@/settings'

const title = defaultSettings.title || 'foo书城'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
