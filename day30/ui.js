export function status(statusText) {
  console.log(statusText);
  document.getElementById("status").textContent = statusText;
}

export function setEnglish(text, translate) {
  document.getElementById("englishSentence").value = text;
  document.getElementById("frenchSentence").textContent = translate(text);
}

export function setTranslationFunction(translate) {
  const englishElement = document.getElementById("englishSentence");
  englishElement.addEventListener("input", e => {
    const inputSentence = englishElement.value;
    document.getElementById("frenchSentence").textContent = translate(
      inputSentence
    );
  });
}

export function disableLoadModelButtons() {
  document.getElementById("load-pretrained-remote").style.display = "none";
  document.getElementById("load-pretrained-local").style.display = "none";
}
