import {Content, setTriggerPoint} from './data';

let backdropClassName: string | undefined;
let containerClassName: string | undefined;
let viewClassName: string | undefined;
let buttonClassName: string | undefined;

export const setBackdropClassName = (c: string) => backdropClassName = c;
export const setContainerClassName = (c: string) => containerClassName = c;
export const setViewClassName = (c: string) => viewClassName = c;
export const setButtonClassName = (c: string) => buttonClassName = c;

export const hideButton = () => {
  document.getElementById('__wcx_trigger_button')?.remove();
};

export const hideContent = () => {
  document.getElementById('__wcx_content')?.remove();
};

export const hideAllElements = () => {
  hideContent();
  hideButton();
};

export const clearContext = () => {
  hideAllElements();
  setTriggerPoint(undefined);
}

export const setContext = (options: {
  triggerPoint: string;
}) => {
  hideAllElements();
  setTriggerPoint(options.triggerPoint, (content) => presentContent({
    content,
  }));
}

export const renderContent = (options: {
  content: Content;
  container: HTMLElement;
}) => {
  const view = document.createElement('iframe');
  view.src = options.content.viewUrl;
  if (viewClassName) {
    view.classList.add(viewClassName);
  }
  options.container.append(view);
};

export const renderContentInModal = (options: {
  content: Content;
}) => {
  const backdrop = document.createElement('div');
  backdrop.id = '__wcx_content';
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.bottom = '0';
  backdrop.style.left = '0';
  backdrop.style.right = '0';
  backdrop.style.zIndex = '3';
  backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  backdrop.onclick = () => hideContent();
  if (backdropClassName) {
    backdrop.classList.add(backdropClassName);
  }

  const modalContainer = document.createElement('div');
  modalContainer.style.position = 'absolute';
  modalContainer.style.top = '50%';
  modalContainer.style.left = '50%';
  modalContainer.style.transform = 'translate(-50%, -50%)';
  modalContainer.style.borderRadius = '10px';
  modalContainer.style.overflow = 'hidden';
  if (containerClassName) {
    modalContainer.classList.add(containerClassName);
  }

  const view = document.createElement('iframe');
  view.src = options.content.viewUrl;
  if (viewClassName) {
    view.classList.add(viewClassName);
  }

  backdrop.append(modalContainer);
  modalContainer.append(view);
  document.body.append(backdrop);
};

export const presentContent = ({
  content,
}: {
  content: Content[];
}) => {
  const popupContent = content.find((c) => c.presentationType === 'popup');
  if (popupContent) {
    renderContentInModal({ content: popupContent });
  }

  const buttonTriggeredContent = content.find((c) => c.presentationType === 'button-triggered');
  if (buttonTriggeredContent && buttonTriggeredContent.buttonConfig) {
    const button = document.createElement('button');
    button.id = '__wcx_trigger_button';
    button.innerText = buttonTriggeredContent.buttonConfig.title;
    button.style.backgroundColor = buttonTriggeredContent.buttonConfig.backgroundColor;
    button.style.color = buttonTriggeredContent.buttonConfig.textColor;
    button.style.borderRadius = `${buttonTriggeredContent.buttonConfig.borderRadius}px`;
    button.style.border = 'none';
    if (buttonClassName) {
      button.classList.add(buttonClassName);
    }
    button.onclick = () => renderContentInModal({ content: buttonTriggeredContent });
    document.body.append(button);
  }
};
