const input = document.getElementById("imageUpload");
const canvas = document.getElementById("imageCanvas");
const buttons = document.querySelectorAll(".buttons button");
const ctx = canvas.getContext("2d");
let imagemAtual = null;
let filtroAtual = "semEscolha"
const descricaoTexto = document.querySelector(".description p");

const matrizes = {
  normal: [1,0,0, 0,1,0, 0,0,1],
  deuteranopia: [0.367,0.861,-0.228, 0.280,0.673,0.047, -0.012,0.043,0.969],
  protanopia:   [0.152,1.053,-0.205, 0.115,0.786,0.099, -0.004,-0.048,1.052],
  tritanopia:   [1.256,-0.077,-0.179, -0.078,0.931,0.148, 0.005,0.691,0.304]
};

const descricoes = {
  semEscolha: "Adicione uma foto e escolha um tipo de daltonismo!",
  normal: "Visão normal (tricromacia): percepção completa das cores, com funcionamento normal dos três tipos de cones.",
  deuteranopia: "Deuteranopia: dificuldade em diferenciar tons de verde. É o tipo mais comum de daltonismo.",
  protanopia: "Protanopia: dificuldade em perceber tons de vermelho, que podem parecer mais escuros ou até inexistentes.",
  tritanopia: "Tritanopia: dificuldade em diferenciar tons de azul e amarelo. É um tipo mais raro de daltonismo."
};


// Aplica o filtro para cada tipo de daltonismo
function aplicarFiltro () {

  if (imagemAtual == null) return
  
    canvas.width = imagemAtual.width;
    canvas.height = imagemAtual.height;
    ctx.drawImage(imagemAtual, 0, 0);
    const imageData = ctx.getImageData (0, 0, canvas.width, 
      canvas.height);
    const data = imageData.data;

    const m = matrizes[filtroAtual]
    for(let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i]     = m[0]*r + m[1]*g + m[2]*b; // novo R
    data[i + 1] = m[3]*r + m[4]*g + m[5]*b; // novo G
    data[i + 2] = m[6]*r + m[7]*g + m[8]*b; // novo B
  }

  ctx.putImageData(imageData, 0, 0);
}


input.addEventListener("change", function(event) {
  // ETAPA 1
  const reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);

  // ETAPA 2
  reader.onload = function(e) {
    console.log(e.target.result);

  // ETAPA 3
  const img = new Image();
  img.src = e.target.result;

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imagemAtual = img;
    aplicarFiltro();
  }
  }
})

buttons.forEach(function(botao) {
  botao.addEventListener("click", function() {
  filtroAtual = botao.dataset.filter
  aplicarFiltro();

  descricaoTexto.textContent = descricoes[filtroAtual];

  buttons.forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
  })
})

descricaoTexto.textContent = descricoes[filtroAtual];