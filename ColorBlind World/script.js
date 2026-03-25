// ─── 1. Pega os elementos da página ───────────────────────────
const imageUpload   = document.getElementById('imageUpload');
const canvas        = document.getElementById('imageCanvas');
const ctx           = canvas.getContext('2d');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterTitle   = document.getElementById('filterTitle');
const filterDesc    = document.getElementById('filterDescription');

// ─── 2. Informações educativas de cada tipo ───────────────────
const filterInfo = {
  normal: {
    title: 'Visão Normal',
    description: 'Todas as cores são percebidas normalmente. Os três tipos de cones (vermelho, verde e azul) funcionam corretamente.'
  },
  deuteranopia: {
    title: 'Deuteranopia',
    description: 'Tipo mais comum de daltonismo. Os cones sensíveis ao verde não funcionam. Verdes e vermelhos se tornam tons de amarelo/marrom indistinguíveis. Afeta ~6% dos homens.'
  },
  protanopia: {
    title: 'Protanopia',
    description: 'Os cones sensíveis ao vermelho não funcionam. Vermelhos aparecem muito escuros ou acinzentados. Afeta ~2% dos homens.'
  },
  tritanopia: {
    title: 'Tritanopia',
    description: 'Tipo mais raro. Os cones sensíveis ao azul não funcionam. Azuis e verdes se confundem, assim como amarelos e violetas. Afeta menos de 0,01% da população.'
  }
};

// ─── 3. Matrizes de transformação de cor ─────────────────────
// Cada matriz transforma os valores RGB de um pixel para simular a visão daltônica
const colorMatrices = {
  normal: [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ],
  deuteranopia: [
    0.367, 0.861, -0.228,
    0.280, 0.673,  0.047,
   -0.012, 0.043,  0.969
  ],
  protanopia: [
    0.152, 1.053, -0.205,
    0.115, 0.786,  0.099,
   -0.004,-0.048,  1.052
  ],
  tritanopia: [
    1.256,-0.077,-0.179,
   -0.078, 0.931, 0.148,
    0.005, 0.691, 0.304
  ]
};

// ─── 4. Estado atual ──────────────────────────────────────────
let currentFilter = 'normal';
let currentImage  = null;

// ─── 5. Quando o usuário escolhe uma imagem ───────────────────
imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      currentImage = img;
      applyFilter();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// ─── 6. Quando o usuário clica num botão de filtro ────────────
filterButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Remove "active" de todos os botões
    filterButtons.forEach(b => b.classList.remove('active'));
    // Adiciona "active" no botão clicado
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    updateInfoPanel();
    applyFilter();
  });
});

// ─── 7. Atualiza o painel educativo ──────────────────────────
function updateInfoPanel() {
  const info = filterInfo[currentFilter];
  filterTitle.textContent = info.title;
  filterDesc.textContent  = info.description;
}

// ─── 8. Aplica o filtro na imagem ─────────────────────────────
function applyFilter() {
  if (!currentImage) return;

  // Define o tamanho do canvas igual ao da imagem
  canvas.width  = currentImage.width;
  canvas.height = currentImage.height;

  // Desenha a imagem original no canvas
  ctx.drawImage(currentImage, 0, 0);

  // Pega os dados de pixel (cada pixel tem 4 valores: R, G, B, Alpha)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data      = imageData.data;
  const matrix    = colorMatrices[currentFilter];

  // Percorre cada pixel e aplica a transformação
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Multiplica o pixel pela matriz de cor
    data[i]     = matrix[0]*r + matrix[1]*g + matrix[2]*b;  // novo R
    data[i + 1] = matrix[3]*r + matrix[4]*g + matrix[5]*b;  // novo G
    data[i + 2] = matrix[6]*r + matrix[7]*g + matrix[8]*b;  // novo B
    // data[i + 3] é o Alpha (transparência) — não mexemos nele
  }

  // Coloca os pixels modificados de volta no canvas
  ctx.putImageData(imageData, 0, 0);
}