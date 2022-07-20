export const generateColor = num => {
  const randomColor = Math.floor((num / 100) * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};
