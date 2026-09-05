import type {ReactNode} from 'react';

export type NvitiNativeAction =
  | 'navigate'
  | 'camera'
  | 'file'
  | 'location'
  | 'push_token'
  | 'close';

export type NvitiNativeRequest = {
  version: 1;
  type: 'nviti.native.request';
  request_id: string;
  widget_id: string;
  action: NvitiNativeAction;
  payload: Record<string, unknown>;
};

export type NvitiNativeResponse = {
  version: 1;
  type: 'nviti.native.response';
  request_id: string;
  ok: boolean;
  result?: unknown;
  error?: string;
};

export type NvitiChatProps = {
  launchUrl: string;
  allowedOrigin: string;
  allowedActions?: readonly NvitiNativeAction[];
  onNativeAction: (request: NvitiNativeRequest) => Promise<unknown>;
  onExternalNavigation?: (url: string) => void;
  onReady?: () => void;
  loadingView?: ReactNode;
  errorView?: (message: string, reload: () => void) => ReactNode;
};
