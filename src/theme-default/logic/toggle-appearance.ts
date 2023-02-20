const APPEARANCE_KEY = 'appearance'

const classList = document.documentElement.classList

const setClassList = (isDark: boolean) => {
  if (isDark) {
    classList.add('dark')
  } else {
    classList.remove('dark')
  }
}

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY)
  setClassList(userPreference === 'dark')
}

if (typeof window !== undefined && typeof localStorage !== 'undefined') {
  updateAppearance()
  window.addEventListener('storage', updateAppearance)
}

export function toggle() {
  const isDark = classList.contains('dark')
  setClassList(!isDark)
  localStorage.setItem(APPEARANCE_KEY, isDark ? 'light' : 'dark')
}
