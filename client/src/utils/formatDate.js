function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;
