export const removeStyles = (html:string) => {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove style attributes and classes from all elements
    const elements = temp.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('style');
      elements[i].removeAttribute('class');
    }

    return temp.innerHTML;
  };