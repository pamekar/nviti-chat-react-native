# Nviti Chat for React Native

An open-source, secure WebView renderer for Nviti conversations. The SDK renders the same forms, menus, bookings, media and handoff experiences as Nviti Web Chat while the host app retains control of native permissions.

## Install

```bash
npm install @nviti/chat-react-native react-native-webview
```

Create a short-lived signed chat session on your server. Pass the returned URL to the SDK; never place an Nviti API credential in a mobile application.

```tsx
<NvitiChat
  launchUrl={signedSessionUrl}
  allowedOrigin="https://bank.nvt.ng"
  allowedActions={['camera', 'file']}
  onNativeAction={handleNativeAction}
/>
```

Only HTTPS, exact-origin navigation is allowed. Native requests are versioned and must be explicitly allowlisted by the host application.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Licensed under Apache-2.0.
