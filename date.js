//jshint esversion:6
export const getDate = () => {
  const today = new Date();
  const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
  }
  return today.toLocaleDateString('en-us', options);
}

export const getDay = () => {
  const today = new Date();
  const options = {
      weekday: 'long',
  }
  return today.toLocaleDateString('en-us', options);
}
  