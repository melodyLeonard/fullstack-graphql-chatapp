export const reduceLastMessage = (data) => {
  if (data.length > 50) {
    return `${data.slice(0, 50)}...`;
  } else {
    return data;
  }
};
