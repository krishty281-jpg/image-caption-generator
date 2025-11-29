const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const captionDiv = document.getElementById("caption");
const loading = document.getElementById("loading");

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFile);
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#f0f0ff";
});
dropZone.addEventListener("dragleave", () => {
  dropZone.style.backgroundColor = "";
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  uploadFile(file);
});

function handleFile() {
  const file = fileInput.files[0];
  if (file) uploadFile(file);
}

function uploadFile(file) {
  preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="preview">`;
  captionDiv.classList.add("hidden");
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("image", file);

  fetch("/generate", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      loading.classList.add("hidden");
      if (data.caption) {
        captionDiv.innerHTML = `<h3>📝 Caption:</h3><p>${data.caption}</p>`;
        captionDiv.classList.remove("hidden");
      } else {
        captionDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        captionDiv.classList.remove("hidden");
      }
    })
    .catch(err => {
      loading.classList.add("hidden");
      captionDiv.innerHTML = `<p style="color:red;">Error: ${err}</p>`;
      captionDiv.classList.remove("hidden");
    });
}
