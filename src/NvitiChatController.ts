import type {RefObject} from 'react';
import type WebView from 'react-native-webview';

export class NvitiChatController {
  private webView: RefObject<WebView<{}> | null> | null = null;

  attach(webView: RefObject<WebView<{}> | null>) {
    this.webView = webView;
  }

  detach() {
    this.webView = null;
  }

  reload() {
    this.webView?.current?.reload();
  }
}
