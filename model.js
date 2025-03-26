document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('load', function () {
    let preloader = document.querySelector('.preloader');
    setTimeout(() => (preloader.style.display = 'none'), 5000);
  });
  const preloadCircle = document.getElementById('preloadcircle');
  let scale = 1;
  let scalingUp = true;
  const animationDuration = 2000; // (2 секунды)
  const delay = 200; // Задержка перед началом анимации (0.2 секунды)

  // Ждем delay миллисекунд, прежде чем начать анимацию
  setTimeout(() => {
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / animationDuration;

      // Проверяем, не закончилась ли анимация (progress > 1)
      if (progress > 1) {
        startTime = currentTime; // Перезапускаем анимацию
      }

      // Вычисляем scale на основе progress
      scale = 1 + Math.abs(Math.sin(progress * Math.PI)) * 2; // От 1 до 3

      preloadCircle.style.transform = `scale(${scale})`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, delay);
});
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
  initThree();
  initNavigation();
  animateStatus();
});

function initThree() {
  const model = document.querySelector('.model');
  if (!model) {
    console.error('Ошибка: контейнер .model не найден!');
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000'); // Здесь настраивается фон, щас черный
  scene.position.set(0, -10, 0);
  // Параметры камеры
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(-130, 80, 50);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'low-power', // Экономия ресурсов
  });
  const modelRect = model.getBoundingClientRect();
  renderer.setSize(modelRect.width, modelRect.height); // Ограниченный размер
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  model.appendChild(renderer.domElement);

  // Подключение модели
  const loader = new GLTFLoader();
  loader.load(
    './model/scene.gltf',
    function (gltf) {
      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error('Ошибка загрузки модели:', error);
    }
  );

  // Добавление света
  const light = new THREE.AmbientLight(0x3d3d3d);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0x9ac4ff, 1.3);
  directionalLight.position.set(-80, 100, 0); // Направленный свет
  light.lookAt(100, 100, 0);
  scene.add(directionalLight);

  // Управление моделью
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; // Отключаем затухание для экономии ресурсов
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2.3;
  controls.hasChanged = false; // Флаг для рендеринга по необходимости

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  controls.addEventListener('change', () => {
    controls.hasChanged = true;
  });

  // Анимация
  animate();

  // Обновление размера окна
  window.addEventListener('resize', onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function initNavigation() {
  const butone = document.querySelector('.butone');
  const buttwo = document.querySelector('.buttwo');
  const description = document.getElementById('description');
  const infocreatures = document.getElementById('infocreatures');
  const closebutton = document.querySelector('.description .closebutton');
  const closebuttonsecond = document.querySelector(
    '.infocreatures .closebuttonsecond'
  );

  function closePopup(popup) {
    popup.classList.add('none');
  }

  function togglePopup(popup) {
    if (popup.classList.contains('none')) {
      popup.classList.remove('none');
    } else {
      popup.classList.add('none');
    }
  }

  butone.addEventListener('click', (event) => {
    event.preventDefault();
    togglePopup(description);
  });

  buttwo.addEventListener('click', (event) => {
    event.preventDefault();
    togglePopup(infocreatures);
  });

  closebutton.addEventListener('click', () => {
    closePopup(description);
  });

  closebuttonsecond.addEventListener('click', () => {
    closePopup(infocreatures);
  });
}
