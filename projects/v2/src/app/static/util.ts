export function validateWidth(width: number, paneOpen = true, paneWidth = 250) {
  if (paneOpen) {
    if (width < 1450)  {
      return 1450
    }
    return width - paneWidth
  } else {
    if (width < 1450) 
      return 1450
    return width
  }
}