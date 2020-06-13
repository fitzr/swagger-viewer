import {
  EXEC_CONVERT_SWAGGER,
  UPDATE_URLS,
} from "../../app-src/shared/constants/SendMessageTypes"
import { ExecConvertSwaggerMessage } from "../../app-src/shared/types/SendMessage"
import { CastAny } from "../../app-src/shared/types/utils"

// TIPS: background script の console.log の出力先は、「バックグラウンドページ」
chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.id == null) {
    throw new Error(`Unexpected tab.id:${tab.id}`)
  }

  chrome.tabs.sendMessage(tab.id, ({
    type: EXEC_CONVERT_SWAGGER,
  } as CastAny) as ExecConvertSwaggerMessage)
})

let urls: string[] = []

chrome.runtime.onInstalled.addListener(() => {
  if (localStorage.urls) {
    urls = localStorage.urls.split("\n")
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === UPDATE_URLS) {
    urls = request.urls
  }
  sendResponse()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && urls.includes(tab.url)) {
    chrome.tabs.sendMessage(tabId, ({
      type: EXEC_CONVERT_SWAGGER,
    } as CastAny) as ExecConvertSwaggerMessage)
  }
})
