import {describe, expect, it} from 'vitest';
import {parseNativeRequest, validateChatConfig} from '../src/protocol';

describe('chat configuration', () => {
  it('accepts an exact secure origin', () => {
    expect(validateChatConfig('https://bank.nvt.ng/chat/abc', 'https://bank.nvt.ng')).toEqual({
      launchUrl: 'https://bank.nvt.ng/chat/abc',
      allowedOrigin: 'https://bank.nvt.ng',
    });
  });

  it('rejects cleartext and cross-origin URLs', () => {
    expect(() => validateChatConfig('http://bank.nvt.ng/chat/abc', 'http://bank.nvt.ng')).toThrow('HTTPS');
    expect(() => validateChatConfig('https://evil.test/chat/abc', 'https://bank.nvt.ng')).toThrow('exact');
  });
});

describe('native protocol', () => {
  it('accepts a supported versioned request', () => {
    expect(parseNativeRequest(JSON.stringify({
      version: 1,
      type: 'nviti.native.request',
      request_id: 'req-1',
      widget_id: 'wid-1',
      action: 'camera',
      payload: {},
    }))?.action).toBe('camera');
  });

  it('ignores malformed and unknown requests', () => {
    expect(parseNativeRequest('{')).toBeNull();
    expect(parseNativeRequest(JSON.stringify({version: 1, type: 'nviti.native.request', request_id: 'x', widget_id: 'w', action: 'shell', payload: {}}))).toBeNull();
  });
});
