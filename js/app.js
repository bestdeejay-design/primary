const appData = {
  passenger: {
    profile: {
      name: 'Александр С.',
      phone: '+7 (985) 123-45-67',
      email: 'alex@example.com',
      avatar: 'АС',
      totalRides: 47,
      totalKm: 842,
      savedMinutes: 156
    },
    recentDestinations: [
      { addr: 'Тверская ул., 12', sub: 'Дом', icon: 'icon-home' },
      { addr: 'Москва-Сити, башня Федерация', sub: 'Работа', icon: 'icon-briefcase' },
      { addr: 'Аэропорт Шереметьево', sub: 'Терминал D', icon: 'icon-location' }
    ],
    carClasses: [
      { name: 'Comfort', price: 590, note: 'Kia K5 / Hyundai Sonata', icon: 'icon-car', min: 4.5 },
      { name: 'Business', price: 990, note: 'Mercedes E-Class / BMW 5', icon: 'icon-car', min: 4.7 },
      { name: 'Premium', price: 1890, note: 'Mercedes S-Class / BMW 7', icon: 'icon-diamond', min: 4.9 },
      { name: 'VIP', price: 3990, note: 'Maybach / Rolls-Royce', icon: 'icon-diamond', min: 5.0 }
    ],
    savedAddresses: [
      { label: 'Дом', addr: 'Тверская ул., 12', icon: 'icon-home', type: 'home' },
      { label: 'Работа', addr: 'Москва-Сити, башня Федерация', icon: 'icon-briefcase', type: 'work' }
    ],
    paymentCards: [
      { type: 'Visa', last4: '3456', default: true },
      { type: 'Mastercard', last4: '7890', default: false }
    ],
    rideHistory: [
      { date: '6 июн', time: '14:30', from: 'Тверская ул., 12', to: 'Москва-Сити', price: 590, status: 'completed', carClass: 'Comfort', driver: 'Дмитрий' },
      { date: '5 июн', time: '09:15', from: 'Москва-Сити', to: 'Аэропорт Шереметьево', price: 1890, status: 'completed', carClass: 'Premium', driver: 'Максим' },
      { date: '3 июн', time: '22:40', from: 'Ресторан «Савой»', to: 'Тверская ул., 12', price: 490, status: 'completed', carClass: 'Comfort', driver: 'Андрей' },
      { date: '1 июн', time: '11:00', from: 'Тверская ул., 12', to: 'БЦ «Ленинградский»', price: 990, status: 'completed', carClass: 'Business', driver: 'Иван' },
      { date: '28 мая', time: '18:30', from: 'Тверская ул., 12', to: 'Патриаршие пруды', price: 390, status: 'cancelled', carClass: 'Comfort', driver: '' }
    ]
  },
  driver: {
    profile: {
      name: 'Дмитрий К.',
      phone: '+7 (903) 555-12-34',
      avatar: 'ДК',
      car: 'Mercedes-Benz E-Class 2024',
      plate: 'А123ММ 777',
      rating: 4.92,
      totalRides: 1286,
      totalEarned: 58900,
      hoursOnline: 42,
      acceptanceRate: 94
    },
    ratings: [
      { stars: 5, count: 870 },
      { stars: 4, count: 230 },
      { stars: 3, count: 45 },
      { stars: 2, count: 12 },
      { stars: 1, count: 8 }
    ],
    incomingRequest: {
      passenger: 'Елена В.',
      rating: 4.8,
      from: 'Тверская ул., 12',
      to: 'Аэропорт Внуково',
      price: 2490,
      time: '12 мин'
    },
    trips: [
      { route: 'Арбат → Тверская', time: '10:30', earn: 490, duration: '14 мин' },
      { route: 'Тверская → Москва-Сити', time: '11:15', earn: 590, duration: '18 мин' },
      { route: 'Москва-Сити → Патрики', time: '12:05', earn: 380, duration: '10 мин' },
      { route: 'Патрики → Шереметьево', time: '13:30', earn: 1890, duration: '35 мин' }
    ]
  }
};

let history = ['home'];
let currentMode = 'passenger';
let isOnline = false;
let rideActive = false;
let selectedCarClass = 0;
let selectedPeriod = 'today';

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  updateThemeIcons(newTheme);
  localStorage.setItem('primary-theme', newTheme);
}

function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-toggle .icon, .theme-toggle-small .icon-sm').forEach(icon => {
    const use = icon.querySelector('use');
    if (use) {
      use.setAttribute('href', theme === 'light' ? '#icon-moon' : '#icon-sun');
    }
  });
}

function loadTheme() {
  const saved = localStorage.getItem('primary-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}

function toggleMode() {
  const knob = document.getElementById('modeKnob');
  const passengerLabel = document.getElementById('passengerLabel');
  const driverLabel = document.getElementById('driverLabel');
  const toggle = document.querySelector('.mode-toggle');

  currentMode = currentMode === 'passenger' ? 'driver' : 'passenger';

  if (knob) {
    if (currentMode === 'driver') {
      toggle.classList.add('driver');
    } else {
      toggle.classList.remove('driver');
    }
  }

  passengerLabel.classList.toggle('active', currentMode === 'passenger');
  driverLabel.classList.toggle('active', currentMode === 'driver');

  const btn = document.querySelector('.btn-primary');
  if (btn) {
    btn.innerHTML = currentMode === 'passenger'
      ? 'Начать поездку <svg class="icon"><use href="#icon-arrow"/></svg>'
      : 'Начать смену <svg class="icon"><use href="#icon-arrow"/></svg>';
  }

  localStorage.setItem('primary-mode', currentMode);
}

function initMode() {
  const saved = localStorage.getItem('primary-mode') || 'passenger';
  if (saved !== currentMode) toggleMode();
}

function openApp() {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  history = ['home'];
  updateBottomNav();
  showPage('home');
}

function closeApp() {
  document.getElementById('landing').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  history = ['home'];
}

function showPage(pageName, btnElement) {
  if (btnElement) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }

  history.push(pageName);
  updateHeader(pageName);
  renderContent(pageName);
  document.getElementById('backBtn').classList.toggle('hidden', history.length <= 1);
}

function goBack() {
  if (history.length > 1) {
    history.pop();
    const prevPage = history[history.length - 1];
    updateHeader(prevPage);
    renderContent(prevPage);
    document.getElementById('backBtn').classList.toggle('hidden', history.length <= 1);
  }
}

function updateHeader(pageName) {
  const titles = {
    home: 'Главная',
    orders: 'Поездки',
    'passenger-profile': 'Профиль',
    'driver-home': 'Главная',
    earnings: 'Доход',
    'driver-profile': 'Профиль',
    'ride-tracking': 'Поездка',
    'favorites': 'Избранное',
    'payment': 'Способы оплаты'
  };
  document.getElementById('appTitle').textContent = titles[pageName] || 'Главная';
}

function renderContent(pageName) {
  const content = document.getElementById('content');
  const mode = currentMode;

  if (pageName === 'home') {
    if (mode === 'passenger') {
      content.innerHTML = renderPassengerHome();
    } else {
      content.innerHTML = renderDriverHome();
    }
  } else if (pageName === 'orders') {
    content.innerHTML = renderOrders();
  } else if (pageName === 'passenger-profile') {
    content.innerHTML = renderPassengerProfile();
  } else if (pageName === 'earnings') {
    content.innerHTML = renderEarnings();
  } else if (pageName === 'driver-profile') {
    content.innerHTML = renderDriverProfile();
  } else if (pageName === 'ride-tracking') {
    content.innerHTML = renderRideTracking();
  } else if (pageName === 'favorites') {
    content.innerHTML = renderFavorites();
  }
}

function updateBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (currentMode === 'passenger') {
    nav.innerHTML = `
      <button class="nav-item active" onclick="showPage('home', this)">
        <svg class="icon-nav"><use href="#icon-home"/></svg>
        <span>Главная</span>
      </button>
      <button class="nav-item" onclick="showPage('orders', this)">
        <svg class="icon-nav"><use href="#icon-list"/></svg>
        <span>Поездки</span>
      </button>
      <button class="nav-item" onclick="showPage('passenger-profile', this)">
        <svg class="icon-nav"><use href="#icon-user"/></svg>
        <span>Профиль</span>
      </button>
    `;
  } else {
    nav.innerHTML = `
      <button class="nav-item active" onclick="showPage('home', this)">
        <svg class="icon-nav"><use href="#icon-home"/></svg>
        <span>Главная</span>
      </button>
      <button class="nav-item" onclick="showPage('earnings', this)">
        <svg class="icon-nav"><use href="#icon-chart"/></svg>
        <span>Доход</span>
      </button>
      <button class="nav-item" onclick="showPage('driver-profile', this)">
        <svg class="icon-nav"><use href="#icon-user"/></svg>
        <span>Профиль</span>
      </button>
    `;
  }
}

function handleProfileClick() {
  if (currentMode === 'passenger') {
    showPage('passenger-profile');
  } else {
    showPage('driver-profile');
  }
}

/* ─── PASSENGER PAGES ─── */

function renderPassengerHome() {
  const p = appData.passenger;
  return `
    <div class="page-content">
      <div class="search-box">
        <svg class="icon"><use href="#icon-location"/></svg>
        <input type="text" placeholder="Куда едем?" value="">
      </div>

      <div class="recent-list">
        ${p.recentDestinations.map(d => `
          <div class="recent-item">
            <svg class="icon"><use href="#${d.icon}"/></svg>
            <div class="info">
              <div class="addr">${d.addr}</div>
              <div class="sub">${d.sub}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="map-placeholder">
        <svg class="icon"><use href="#icon-map"/></svg>
        <span>Карта</span>
      </div>

      <div class="section-title">Выберите класс</div>
      <div class="car-classes">
        ${p.carClasses.map((c, i) => `
          <div class="car-class ${i === selectedCarClass ? 'active' : ''}" onclick="selectCarClass(${i})">
            <svg class="icon"><use href="#${c.icon}"/></svg>
            <div class="name">${c.name}</div>
            <div class="price">${c.price} ₽</div>
            <div class="note">${c.note}</div>
          </div>
        `).join('')}
      </div>

      <button class="btn-ride" onclick="startRide()">
        <svg class="icon"><use href="#icon-car"/></svg>
        Заказать ${p.carClasses[selectedCarClass].name}
      </button>
    </div>
  `;
}

function renderOrders() {
  const rides = appData.passenger.rideHistory;
  return `
    <div class="page-content">
      <div class="section-title">История поездок</div>
      <div class="ride-history">
        ${rides.map(r => `
          <div class="ride-card">
            <div class="ride-header">
              <span class="ride-date">${r.date} • ${r.time}</span>
              <span class="ride-price">${r.price} ₽</span>
            </div>
            <div class="ride-route">
              <div class="route-stop">
                <div class="route-dot start"></div>
                <span>${r.from}</span>
              </div>
              <div class="route-line"></div>
              <div class="route-stop">
                <div class="route-dot end"></div>
                <span>${r.to}</span>
              </div>
            </div>
            <div class="ride-footer">
              <span class="ride-status-badge ${r.status}">${r.status === 'completed' ? 'Завершена' : 'Отменена'}</span>
              <span class="ride-car-class">${r.carClass}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPassengerProfile() {
  const p = appData.passenger.profile;
  const stats = appData.passenger;
  return `
    <div class="page-content">
      <div class="profile-header">
        <div class="profile-avatar">${p.avatar}</div>
        <div>
          <div class="profile-name">${p.name}</div>
          <div class="profile-phone">${p.phone}</div>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">${p.totalRides}</div>
          <div class="stat-label">Поездки</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${p.totalKm}</div>
          <div class="stat-label">Км</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${p.savedMinutes}</div>
          <div class="stat-label">Мин</div>
        </div>
      </div>

      <div class="profile-section">
        <div class="profile-section-title">Избранное</div>
        ${appData.passenger.savedAddresses.map(a => `
          <div class="profile-row" onclick="showPage('favorites')">
            <div class="row-icon"><svg class="icon"><use href="#${a.icon}"/></svg></div>
            <span class="row-label">${a.label}</span>
            <span class="row-value">${a.addr}</span>
            <svg class="icon icon-arrow"><use href="#icon-arrow"/></svg>
          </div>
        `).join('')}
      </div>

      <div class="profile-section">
        <div class="profile-section-title">Способы оплаты</div>
        ${appData.passenger.paymentCards.map(c => `
          <div class="profile-row">
            <div class="row-icon"><svg class="icon"><use href="#icon-card"/></svg></div>
            <span class="row-label">${c.type} ••${c.last4}</span>
            <span class="row-value">${c.default ? 'По умолчанию' : ''}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFavorites() {
  return `
    <div class="page-content">
      <div class="section-title">Сохранённые адреса</div>
      <div class="fav-addresses">
        ${appData.passenger.savedAddresses.map(a => `
          <div class="fav-item">
            <div class="fav-icon ${a.type}"><svg class="icon"><use href="#${a.icon}"/></svg></div>
            <div class="fav-info">
              <div class="fav-label">${a.label}</div>
              <div class="fav-addr">${a.addr}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─── DRIVER PAGES ─── */

function renderDriverHome() {
  if (rideActive) {
    return renderDriverRideActive();
  }

  const req = appData.driver.incomingRequest;
  return `
    <div class="page-content">
      <div class="online-toggle-wrapper">
        <span class="toggle-label ${isOnline ? 'online' : 'offline'}">${isOnline ? 'На линии' : 'Не в сети'}</span>
        <div class="online-toggle ${isOnline ? 'active' : ''}" onclick="toggleOnline()">
          <div class="toggle-btn"></div>
        </div>
      </div>

      ${isOnline ? `
        <div class="ride-request">
          <div class="request-header">
            <span class="request-title">Новый заказ</span>
            <span class="request-price">${req.price} ₽</span>
          </div>
          <div class="request-passenger">
            <div class="passenger-avatar">${req.passenger[0]}</div>
            <div>
              <div class="passenger-name">${req.passenger}</div>
              <div class="passenger-rating"><svg class="icon" style="width:14px;height:14px;vertical-align:middle"><use href="#icon-star"/></svg> ${req.rating}</div>
            </div>
          </div>
          <div class="request-route">
            <div class="route-stop">
              <div class="route-dot start"></div>
              <span>${req.from}</span>
            </div>
            <div class="route-line"></div>
            <div class="route-stop">
              <div class="route-dot end"></div>
              <span>${req.to}</span>
            </div>
          </div>
          <div class="request-actions">
            <button class="btn-accept" onclick="acceptRide()">Принять</button>
            <button class="btn-decline" onclick="declineRide()">Отклонить</button>
          </div>
        </div>`
      : `
        <div class="card text-center" style="padding: 40px 20px">
          <svg class="icon" style="width:48px;height:48px;color:var(--text-muted);margin-bottom:12px"><use href="#icon-car"/></svg>
          <div style="font-size:16px;font-weight:500;margin-bottom:8px">Вы не на линии</div>
          <div style="font-size:13px;color:var(--text-muted)">Включите режим онлайн, чтобы получать заказы</div>
        </div>
      `}
    </div>
  `;
}

function renderDriverRideActive() {
  const driver = appData.driver.profile;
  return `
    <div class="page-content">
      <div class="ride-tracking">
        <div class="ride-status">
          <svg class="icon status-icon"><use href="#icon-navigation"/></svg>
          <div class="status-text">Едем к вам</div>
          <div class="status-sub">Водитель на пути к точке посадки</div>
        </div>

        <div class="ride-progress">
          <div class="ride-stop">
            <div class="dot current"></div>
            <div class="stop-info">
              <div class="label">Посадка</div>
              <div class="addr">Тверская ул., 12</div>
            </div>
          </div>
          <div class="ride-stop">
            <div class="line active"></div>
            <div class="stop-info">
              <div class="label">Прибытие</div>
              <div class="addr">Через 5 мин</div>
            </div>
          </div>
          <div class="ride-stop">
            <div class="line"></div>
            <div class="stop-info">
              <div class="label">Конечная</div>
              <div class="addr">Москва-Сити</div>
            </div>
          </div>
        </div>

        <div class="ride-driver">
          <div class="avatar">${driver.avatar}</div>
          <div class="driver-info">
            <div class="driver-name">${driver.name}</div>
            <div class="driver-car">${driver.car}</div>
          </div>
          <div class="driver-rating">
            <svg class="icon"><use href="#icon-star"/></svg>
            ${driver.rating}
          </div>
        </div>

        <div class="ride-actions">
          <button class="btn-ride-action success" onclick="completeRide()">Завершить</button>
          <button class="btn-ride-action danger" onclick="cancelRide()">Отменить</button>
        </div>
      </div>
    </div>
  `;
}

function renderEarnings() {
  const d = appData.driver.profile;
  const trips = appData.driver.trips;
  const todayEarn = trips.reduce((s, t) => s + t.earn, 0);

  return `
    <div class="page-content">
      <div class="earnings-period">
        <button class="period-btn active" onclick="selectPeriod('today', this)">Сегодня</button>
        <button class="period-btn" onclick="selectPeriod('week', this)">Неделя</button>
        <button class="period-btn" onclick="selectPeriod('month', this)">Месяц</button>
      </div>

      <div class="earnings-total">
        <div class="amount">${todayEarn} ₽</div>
        <div class="label">Заработано сегодня</div>
      </div>

      <div class="earnings-breakdown">
        <div class="earnings-item">
          <div class="value">${trips.length}</div>
          <div class="label">Поездки</div>
        </div>
        <div class="earnings-item">
          <div class="value">${d.acceptanceRate}%</div>
          <div class="label">Принято</div>
        </div>
        <div class="earnings-item">
          <div class="value">${d.hoursOnline}</div>
          <div class="label">Часов</div>
        </div>
        <div class="earnings-item">
          <div class="value">4.9</div>
          <div class="label">Рейтинг</div>
        </div>
      </div>

      <div class="section-title">Последние поездки</div>
      <div class="trip-list">
        ${trips.map(t => `
          <div class="trip-item">
            <div class="trip-info">
              <div class="trip-route">${t.route}</div>
              <div class="trip-time">${t.time} · ${t.duration}</div>
            </div>
            <div class="trip-earn">+${t.earn} ₽</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderDriverProfile() {
  const d = appData.driver.profile;
  const ratings = appData.driver.ratings;
  const totalRatings = ratings.reduce((s, r) => s + r.count, 0);

  return `
    <div class="page-content">
      <div class="driver-profile-header">
        <div class="avatar">${d.avatar}</div>
        <div class="name">${d.name}</div>
        <div class="rating">
          <svg class="icon" style="width:16px;height:16px"><use href="#icon-star"/></svg>
          ${d.rating}
          <span style="color:var(--text-muted);font-weight:400;font-size:12px">(${totalRatings} оценок)</span>
        </div>
      </div>

      <div class="vehicle-card">
        <div class="vehicle-title">Автомобиль</div>
        <div class="vehicle-name">${d.car}</div>
        <div class="vehicle-plate">${d.plate}</div>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">${d.totalRides}</div>
          <div class="stat-label">Поездки</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${d.totalEarned.toLocaleString()}</div>
          <div class="stat-label">Заработано</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${d.acceptanceRate}%</div>
          <div class="stat-label">Принято</div>
        </div>
      </div>

      <div class="profile-section">
        <div class="profile-section-title">Детали рейтинга</div>
        <div class="rating-bars">
          ${ratings.map(r => {
            const pct = (r.count / totalRatings) * 100;
            return `
              <div class="rating-row">
                <span class="star-label">${r.stars} ★</span>
                <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
                <span class="bar-count">${r.count}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderRideTracking() {
  const driver = appData.driver.profile;
  return `
    <div class="page-content">
      <div class="ride-tracking">
        <div class="ride-status">
          <svg class="icon status-icon"><use href="#icon-navigation"/></svg>
          <div class="status-text">Едем к вам</div>
          <div class="status-sub">Водитель на пути к точке посадки</div>
        </div>

        <div class="ride-progress">
          <div class="ride-stop">
            <div class="dot current"></div>
            <div class="stop-info">
              <div class="label">Посадка</div>
              <div class="addr">Тверская ул., 12</div>
            </div>
          </div>
          <div class="ride-stop">
            <div class="line active"></div>
            <div class="stop-info">
              <div class="label">Прибытие</div>
              <div class="addr">Через 5 мин</div>
            </div>
          </div>
          <div class="ride-stop">
            <div class="line"></div>
            <div class="stop-info">
              <div class="label">Конечная</div>
              <div class="addr">Москва-Сити</div>
            </div>
          </div>
        </div>

        <div class="ride-driver">
          <div class="avatar">${driver.avatar}</div>
          <div class="driver-info">
            <div class="driver-name">${driver.name}</div>
            <div class="driver-car">${driver.car}</div>
          </div>
          <div class="driver-rating">
            <svg class="icon"><use href="#icon-star"/></svg>
            ${driver.rating}
          </div>
        </div>

        <div class="ride-actions">
          <button class="btn-ride-action success" onclick="completeRide()">Завершить</button>
          <button class="btn-ride-action danger" onclick="cancelRide()">Отменить</button>
        </div>
      </div>
    </div>
  `;
}

/* ─── ACTIONS ─── */

function selectCarClass(index) {
  selectedCarClass = index;
  renderContent('home');
}

function startRide() {
  rideActive = true;
  showPage('ride-tracking');
  updateBottomNav();
}

function toggleOnline() {
  isOnline = !isOnline;
  renderContent('home');
}

function acceptRide() {
  rideActive = true;
  renderContent('home');
}

function declineRide() {
  renderContent('home');
}

function completeRide() {
  rideActive = false;
  showPage('home');
}

function cancelRide() {
  rideActive = false;
  showPage('home');
}

function selectPeriod(period, btn) {
  selectedPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

loadTheme();
initMode();
