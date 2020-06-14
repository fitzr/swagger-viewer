import { getDocument } from "../../app-src/contentscript/data/QuerySelector/Document"
import { UPDATE_URLS } from "../../app-src/shared/constants/SendMessageTypes"

const init = (): void => {
  const document = getDocument()
  const $urls = document.getElementById("urls") as HTMLTextAreaElement
  const $save = document.getElementById("save") as HTMLButtonElement
  if (localStorage.urls) {
    $urls.value = localStorage.urls
  }
  $save.addEventListener(
    "click",
    () => {
      localStorage.urls = $urls.value
      chrome.runtime.sendMessage(
        {
          type: UPDATE_URLS,
          urls: $urls.value,
        },
        () => {
          window.close()
        }
      )
    },
    false
  )
}

getDocument().addEventListener("DOMContentLoaded", init)
