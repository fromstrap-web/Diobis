import { useEffect } from 'react'

export default function useFuncAtEndOfScroll(action) {
  useEffect(() => {
    window.onscroll = function () {
      const howMuchToTheEnd = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY

      if (scrolled === howMuchToTheEnd) return action()
    }
  }, [action])
}
