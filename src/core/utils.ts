export const changeSearch = (data: Record<string, string>) => {
  const search = new URLSearchParams(data);
  const base = window.location.origin + window.location.pathname + "?" + search;
  window.history.replaceState({}, document.title, base);
};

export const getSearch = () => {
  const search = new URLSearchParams(window.location.search);
  return Object.fromEntries(search.entries());
};
