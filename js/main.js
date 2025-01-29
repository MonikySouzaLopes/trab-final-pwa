

// Registrando o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
            console.log('Service worker registrado! 🤩', reg);
        } catch (err) {
            console.log('😢 Service worker registro falhou: ', err);
        }
    });
}

// Configurando as restrições do vídeo stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Capturando os elementos em tela
const cameraView = document.querySelector("#camera-view"),
      cameraOutput = document.querySelector("#camera-output"),
      cameraSensor = document.querySelector("#camera-sensor"),
      cameraTrigger = document.querySelector("#camera-trigger"),
      cameraButton = document.querySelector("#cameraButton"),
      captureButton = document.querySelector("#captureButton"),
      itemInput = document.getElementById("itemInput"),
      addItemButton = document.getElementById("addItem"),
      itemList = document.getElementById("itemList");

let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

// Função para iniciar a câmera
function cameraStart() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            let track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Ocorreu um erro ao acessar a câmera.", error);
        });
}

// Função para capturar imagem
captureButton.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    alert("Imagem capturada com sucesso!");
};

// Função para adicionar item à lista de compras
addItemButton.addEventListener("click", () => {
    const item = itemInput.value.trim();
    if (item) {
        shoppingList.push(item);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        updateList();
    }
    itemInput.value = "";
});

// Atualiza a lista de compras na tela
function updateList() {
    itemList.innerHTML = "";
    shoppingList.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item;
        itemList.appendChild(li);
    });
}

// Inicia a câmera ao clicar no botão
cameraButton.onclick = cameraStart;

// Carrega lista de compras ao iniciar a página
updateList();
