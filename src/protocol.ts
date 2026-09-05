import type {NvitiNativeAction, NvitiNativeRequest} from './types';

export const supportedActions = new Set<NvitiNativeAction>([
  'navigate',
  'camera',
  'file',
  'location',
  'push_token',
  'close',
]);

export function validateChatConfig(launchUrl: string, allowedOrigin: string) {
  const launch = new URL(launchUrl);
  const origin = new URL(allowedOrigin);
  if (launch.protocol !== 'https:' || origin.protocol !== 'https:') {
    throw new Error('Nviti chat requires HTTPS URLs.');
  }
  if (origin.origin !== allowedOrigin.replace(/\/$/, '') || launch.origin !== origin.origin) {
    throw new Error('The launch URL must match the exact allowed origin.');
  }
  return {launchUrl: launch.toString(), allowedOrigin: origin.origin};
}

export function parseNativeRequest(value: string): NvitiNativeRequest | null {
  let raw: unknown;
  try {
    raw = JSON.parse(value);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;
  const request = raw as Partial<NvitiNativeRequest>;
  if (
    request.version !== 1 ||
    request.type !== 'nviti.native.request' ||
    typeof request.request_id !== 'string' ||
    request.request_id.length === 0 ||
    typeof request.widget_id !== 'string' ||
    !supportedActions.has(request.action as NvitiNativeAction) ||
    !request.payload ||
    typeof request.payload !== 'object'
  ) {
    return null;
  }
  return request as NvitiNativeRequest;
}
