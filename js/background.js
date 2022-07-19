const images = ["0.jpg", "1.jpg", "2.jpg"];

const chosenImage = images[Math.floor(Math.random() * images.length)];

// const bgImage = document.createElement("img");

// bgImage.src = `img/${chosenImage}`;

document.body.style.backgroundImage = `url("../img/${chosenImage}")`;
// 이미지 교체 필요(해상도 및 파일 크기 초과)
