import {setBackdropClassName, setButtonClassName, setContainerClassName, setViewClassName} from './ui';

type UserIdentity = {id: string; verificationHash: string};

const DEFAULT_API_BASE_URL = 'https://api.wavecx.com';

let apiBaseUrl = DEFAULT_API_BASE_URL;
let organizationCode: string | undefined;
let userIdentity: UserIdentity | undefined;
let currentTriggerPoint: string | undefined;
let contentTypes = ['featurette'];
let platform: 'desktop' | 'mobile' = 'desktop';

export const initialize = (options: {
  organizationCode: string;
  userIdentity?: UserIdentity;
  apiBaseUrl?: string;
  platform?: 'desktop' | 'mobile';
  contentTypes?: ('featurette' | 'form' | 'page' | 'demo')[];
  backdropClassName?: string;
  containerClassName?: string;
  viewClassName?: string;
  buttonClassName?: string;
}) => {
  organizationCode = options.organizationCode;
  userIdentity = options.userIdentity;
  apiBaseUrl = options.apiBaseUrl ?? DEFAULT_API_BASE_URL;
  platform = options.platform ?? 'desktop';
  contentTypes = options.contentTypes ?? ['featurette'];
  if (options.backdropClassName) {
    setBackdropClassName(options.backdropClassName);
  }
  if (options.containerClassName) {
    setContainerClassName(options.containerClassName);
  }
  if (options.viewClassName) {
    setViewClassName(options.viewClassName);
  }
  if (options.buttonClassName) {
    setButtonClassName(options.buttonClassName);
  }
}

export const setUser = (identity: UserIdentity | undefined) => userIdentity = identity;

export const setOrganization = (newOrganizationCode: string) => organizationCode = newOrganizationCode;

export type Content = {
  triggerPoint: string;
  viewUrl: string;
  presentationType: 'popup' | 'button-triggered';
  buttonConfig?: {
    title: string;
    textColor: string;
    backgroundColor: string;
    borderRadius: number;
  };
};

export const setTriggerPoint = (triggerPoint?: string, onNewContent?: (content: Content[]) => void) => {
  currentTriggerPoint = triggerPoint;
  if (currentTriggerPoint) {
    tryCheckForContent({triggerPoint: currentTriggerPoint}).then((result) => {
      if (result.ok) {
        onNewContent?.(result.content);
      }
    });
  }
}

export type TryCheckForContentResult =
  | {ok: true; content: Content[]}
  | {ok: false; error: 'user-not-identified' | 'identity-verification-failed' | 'network-error' | 'unknown'};

export const tryCheckForContent = async ({
  triggerPoint,
}: {
  triggerPoint: string;
}): Promise<TryCheckForContentResult> => {
  if (!userIdentity) {
    return {ok: false, error: 'user-not-identified'};
  }

  try {
    const response = await fetch(`${apiBaseUrl}/${organizationCode}/targeted-content-events`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        type: 'trigger-point',
        userId: userIdentity.id,
        userIdVerification: userIdentity.verificationHash,
        triggerPoint,
        platform,
        contentTypes,
      }),
    });
    if (response.status !== 201) {
      return {
        ok: false,
        error: response.status === 401 ? 'identity-verification-failed' : 'unknown',
      };
    }

    const responseBody = await response.json();
    return {ok: true, content: responseBody.content};
  } catch {
    return {ok: false, error: 'network-error'};
  }
};
