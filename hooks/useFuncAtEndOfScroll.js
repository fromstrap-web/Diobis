import { useEffect } from 'react'

export default function useFuncAtEndOfScroll(action) {
  useEffect(() => {
    window.onscroll = function () {
      const howMuchToTheEnd = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY + 100)

      if ((scrolled + 100) >= howMuchToTheEnd) return action()
    }
  }, [action])
}
