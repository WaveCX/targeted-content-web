import {Content} from './data';

export const renderContent = (options: {
  content: Content;
  containerSelector: string;
  viewClassName?: string;
}) => {
  const container = document.querySelector(options.containerSelector);
  const view = document.createElement('iframe');
  view.src = options.content.viewUrl;
  if (options.viewClassName) {
    view.classList.add(options.viewClassName);
  }
  container?.append(view);
};
