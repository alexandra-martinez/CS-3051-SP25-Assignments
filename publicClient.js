document.getElementById('getImage').addEventListener('click', () => {
  fetch('/random-image')
    .then(res => res.text())
    .then(url => {
      document.getElementById('randomImage').src = url;
    });
});

function loadSnippet(name) {
  fetch(`/snippet/${name}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('contentArea').innerHTML = html;
    });
}
