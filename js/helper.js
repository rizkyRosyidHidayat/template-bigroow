function updateUrlParams(url, params) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);

  Object.keys(params).forEach((key) => {
    if (params[key] !== null) searchParams.set(key, params[key]);
    else searchParams.delete(key);
  });
  urlObject.search = searchParams.toString();
  return urlObject.href;
}

const getData = async (baseUrl) =>
  await fetch(baseUrl)
    .then((response) => response.json())
    .then((json) => json);

const setTextContent = (id, text) => {
  const el = document.querySelector(`#${id}`);
  el.textContent = text;
};

function createElement(el, className, parent, isReplace) {
  const element = document.createElement(el);
  element.className = className;
  if (parent) {
    if (!isReplace) parent.appendChild(element);
    else parent.replaceChildren(element);
  }
  return element;
}

const helper = {
  updateUrlParams,
  getData,
  setTextContent,
  createElement,
};
export default helper;
