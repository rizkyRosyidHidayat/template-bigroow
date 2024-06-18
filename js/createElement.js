export default function createElement(el, className, parent, isReplace) {
  const element = document.createElement(el);
  element.className = className;
  if (parent) {
    if (!isReplace) parent.appendChild(element);
    else parent.replaceChildren(element);
  }
  return element;
}
