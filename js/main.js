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
var constraints = { video: { facingMode: "environment" }, audio: false };

// Capturando os elementos da interface
const cameraView = document.querySelector("#camera-view"),
      cameraOutput = document.querySelector("#camera-output"),
      cameraSensor = document.querySelector("#camera-sensor"),
      cameraTrigger = document.querySelector("#camera-trigger"),
      cameraButton = document.querySelector("#cameraButton"),
      captureButton = document.querySelector("#captureButton");

// Função para iniciar a câmera
function cameraStart() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            cameraView.srcObject = stream;
            cameraView.style.display = "block"; // Certifique-se de que o vídeo está visível
        })
        .catch(function (error) {
            console.error("Ocorreu um erro ao acessar a câmera.", error);
            alert("Erro ao acessar a câmera. Verifique as permissões.");
        });
}

// Evento para ativar a câmera ao clicar no botão
cameraButton.addEventListener("click", () => {
    cameraStart();
});

// Função para capturar imagem
captureButton.addEventListener("click", () => {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    
    // Mostra a imagem capturada
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    cameraOutput.style.display = "block"; // Agora a imagem capturada aparece na tela
    
    alert("Imagem capturada com sucesso!");
});

// Iniciar a câmera ao carregar a página
window.addEventListener("load", cameraStart);

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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.style.marginLeft = "10px";
        deleteButton.addEventListener("click", () => removeItem(index));

        li.appendChild(deleteButton);
        itemList.appendChild(li);
    });
}

// Função para remover item da lista
function removeItem(index) {
    shoppingList.splice(index, 1);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    updateList();
}

// Inicia a câmera ao clicar no botão
cameraButton.onclick = cameraStart;

// Carrega lista de compras ao iniciar a página
updateList();
