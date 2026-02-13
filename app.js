const imageInput = document.getElementById('imageInput');
const fileName = document.getElementById('fileName');
const widthValue = document.getElementById('widthValue');
const heightValue = document.getElementById('heightValue');
const pixelValue = document.getElementById('pixelValue');
const megaPixelValue = document.getElementById('megaPixelValue');
const errorText = document.getElementById('errorText');
const preview = document.getElementById('preview');
const uploadForm = document.getElementById('uploadForm');
const burst = document.getElementById('burst');

const formatNumber = (value) => new Intl.NumberFormat().format(value);
const burstColors = ['#7c9bff', '#51e2c2', '#f4d35e', '#ff8fab', '#9bff9b'];

const resetValues = () => {
  widthValue.textContent = '-';
  heightValue.textContent = '-';
  pixelValue.textContent = '-';
  megaPixelValue.textContent = '-';
  preview.style.display = 'none';
  preview.removeAttribute('src');
};

const playUploadAnimation = () => {
  burst.innerHTML = '';

  for (let i = 0; i < 18; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.left = `${45 + Math.random() * 10}%`;
    dot.style.top = `${35 + Math.random() * 20}%`;
    dot.style.background = burstColors[i % burstColors.length];

    const angle = (Math.PI * 2 * i) / 18;
    const distance = 55 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    dot.style.setProperty('--dx', `${dx}px`);
    dot.style.setProperty('--dy', `${dy}px`);

    burst.appendChild(dot);
  }

  uploadForm.classList.remove('play-burst');
  void uploadForm.offsetWidth;
  uploadForm.classList.add('play-burst');
};

imageInput.addEventListener('change', (event) => {
  errorText.textContent = '';
  const [file] = event.target.files;

  if (!file) {
    fileName.textContent = 'No file selected';
    resetValues();
    return;
  }

  fileName.textContent = file.name;

  if (!file.type.startsWith('image/')) {
    errorText.textContent = 'Please choose a valid image file.';
    resetValues();
    return;
  }

  const fileURL = URL.createObjectURL(file);
  const img = new Image();

  img.onload = () => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const totalPixels = width * height;
    const megapixels = totalPixels / 1_000_000;

    widthValue.textContent = `${formatNumber(width)} px`;
    heightValue.textContent = `${formatNumber(height)} px`;
    pixelValue.textContent = formatNumber(totalPixels);
    megaPixelValue.textContent = `${megapixels.toFixed(2)} MP`;

    preview.src = fileURL;
    preview.style.display = 'block';

    playUploadAnimation();

    URL.revokeObjectURL(fileURL);
  };

  img.onerror = () => {
    errorText.textContent = 'Unable to read this image. Try another file.';
    resetValues();
    URL.revokeObjectURL(fileURL);
  };

  img.src = fileURL;
});
