/* eslint-disable import/prefer-default-export */

export const openFileDialog = (accept, callback) => () => {
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = accept;
  inputElement.addEventListener('change', callback);
  inputElement.dispatchEvent(new MouseEvent('click'));
};
