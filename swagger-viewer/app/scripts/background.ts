import {
  EXEC_CONVERT_SWAGGER,
  EXEC_CONVERT_SWAGGER_IF_NOT_CONVERTED,
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

let urlList: string[] = []

chrome.runtime.onInstalled.addListener(() => {
  if (localStorage.urls) {
    urlList = localStorage.urls.split("\n")
  }
})

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === UPDATE_URLS) {
    urlList = request.urls.split("\n")
  }
  sendResponse()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    urlList.includes(tab.url)
  ) {
    chrome.tabs.sendMessage(tabId, ({
      type: EXEC_CONVERT_SWAGGER_IF_NOT_CONVERTED,
    } as CastAny) as ExecConvertSwaggerMessage)
  }
})
