export function validateWidth(width: number, paneOpen = true, paneWidth = 250) {
  if (paneOpen) {
    if (width - paneWidth < 1550) 
      return 1550
    return width - paneWidth
  } else {
    if (width < 1550) 
      return 1550
    return width
  }
 

  
}