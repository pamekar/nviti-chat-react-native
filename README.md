# Nviti Chat react-native SDK

Embed the shared Nviti conversation engine: messages, configured forms, menus,
bookings and human handoff. Apache-2.0 licensed.

## Source installation

Node 20+, React Native and react-native-webview are required. Tested with the
React Native 0.76 demo. npm registry publication is not yet available.
```sh
npm install github:pamekar/nviti-chat-react-native#v0.1.0 react-native-webview
```
The Git dependency builds TypeScript through its prepare script. Pin a released
tag/commit for deployment. On iOS, install CocoaPods dependencies for your app.

## Close-only integration

Import `NvitiChat` from `@nviti/chat-react-native`. Use the backend-issued URL:
```tsx
<NvitiChat
  launchUrl={launchUrl}
  allowedOrigin="https://YOUR_TENANT.nvt.ng"
  allowedActions={['close']}
  onNativeAction={async request => {
    if (request.action !== 'close') throw new Error('Unsupported action');
    setChatOpen(false);
    return {handled: true};
  }}
/>
```

Here `setChatOpen` is host React state that unmounts the chat. Provide a native
Close button too. [Complete demo](https://github.com/pamekar/nviti-demo-app-react-native).

Development: `npm ci && npm run typecheck && npm test && npm run build`.

## Integration guide

Read [secure sessions, lifecycle, native permissions, feature boundaries and troubleshooting](docs/integration.md).
Never embed a server API credential or trust a client-entered phone number as identity.
