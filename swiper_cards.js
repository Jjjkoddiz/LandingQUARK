document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initCardEffects();
});

function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) {
    console.error('.slider не найден!');
    return;
  }

  const swiper = new Swiper('.slider', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    mousewheel: true,
    grabCursor: true,
    effect: 'slide',
    on: {
      slideChangeTransitionStart: function () {
        const activeElement = document.querySelector(
          '.swiper-slide-active .creature-image'
        );
        if (activeElement) {
          const backgroundImage = document.querySelector('#background-image');
          if (backgroundImage) {
            backgroundImage.src = activeElement.src;
            backgroundImage.animate([{ opacity: 0 }, { opacity: 0.5 }], {
              duration: 100,
              fill: 'forwards',
            });
          }
        }
      },
    },
  });
}

function initCardEffects() {
  const creatures = document.querySelectorAll('.creature');
  const rotations = new Map(); // Храним целевые углы для каждой карточки

  creatures.forEach((creature) => {
    rotations.set(creature, { x: 0, y: 0 });

    creature.addEventListener('mousemove', (e) => {
      const rect = creature.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      const rotateX = (mouseY / rect.height) * 10;
      const rotateY = (mouseX / rect.width) * -10;
      rotations.set(creature, { x: rotateX, y: rotateY });
    });

    creature.addEventListener('mouseleave', () => {
      rotations.set(creature, { x: 0, y: 0 });
    });
  });

  // Обновление карточек через requestAnimationFrame
  function updateCards() {
    creatures.forEach((creature) => {
      const { x, y } = rotations.get(creature);
      creature.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(1)`;
    });
    requestAnimationFrame(updateCards);
  }
  requestAnimationFrame(updateCards);
}

document.addEventListener('DOMContentLoaded', function () {
  const movetextSpan = document.getElementById('movetext');

  if (!movetextSpan) {
    console.error('Элемент movetext не найден');
    return;
  }

  let offset = 0;
  const speed = 5; // Скорость движения (пикселей в кадр)

  function animate() {
    offset += speed;
    movetextSpan.style.transform = `translateX(-${offset}px)`;

    // Если текст ушел за левый край экрана, возвращаем его в начало
    if (offset > movetextSpan.offsetWidth) {
      offset = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
});

// Третий экран, делаю так, чтобы лодка не возвращалась до обновления страницы

document.addEventListener('DOMContentLoaded', function () {
  const createAccountBtn = document.getElementById('createAccountBtn');
  const submarine = document.getElementById('submarine');
  const nameInput = document.querySelector('input[placeholder="User Name"]');
  const emailInput = document.querySelector('input[placeholder="User Email"]');
  const passwordInput = document.querySelector('input[placeholder="Password"]');
  const modal = document.getElementById('myModal');
  const modalText = document.getElementById('modalText');
  const closeButton = document.querySelector('.close-button');

  // **Добавляем проверку существования modal**
  if (!modal) {
    console.error('Модальное окно не найдено!');
    return; // Прекращаем выполнение, если модальное окно не найдено
  }

  modal.style.display = 'none';

  if (sessionStorage.getItem('submarineGo') === 'true') {
    submarine.classList.add('go');
  }

  createAccountBtn.addEventListener('click', function (event) {
    event.preventDefault();

    if (nameInput.value && emailInput.value && passwordInput.value) {
      submarine.classList.add('go');
      sessionStorage.setItem('submarineGo', 'true');

      setTimeout(function () {
        sessionStorage.removeItem('submarineGo');
      }, 1000);
    } else {
      // Заменяем alert на отображение модального окна
      modal.style.display = 'flex'; // Показываем модальное окно
    }
  });

  // Добавляем обработчик клика на кнопку закрытия
  if (closeButton) {
    // Проверка на null, если кнопка закрытия отсутствует
    closeButton.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }

  // Закрываем модальное окно при клике вне его
  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
});
