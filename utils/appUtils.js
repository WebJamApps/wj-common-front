exports.checkUser = async function checkUser(app) {
  let uid;
  if (app.auth.isAuthenticated()) {
    app.authenticated = true; // eslint-disable-line no-param-reassign
    try {
      uid = app.auth.getTokenPayload().sub;
    } catch (e) {
      app.logout();
      localStorage.clear();
      return Promise.resolve('bad token');
    }
    app.user = await app.appState.getUser(uid);// eslint-disable-line no-param-reassign
    if (app.user !== undefined) app.role = app.user.userType;// eslint-disable-line no-param-reassign
  }
  return Promise.resolve(true);
};

exports.checkIfLoggedIn = function checkIfLoggedIn(app) {
  const token = localStorage.getItem('aurelia_id_token');
  if (token !== null && token !== undefined) {
    try {
      app.auth.getTokenPayload();
      app.auth.setToken(token);
      app.authenticated = true;// eslint-disable-line no-param-reassign
      app.router.navigate('dashboard');
      return true;
    } catch (e) {
      app.logout();
      return false;
    }
  }
  return false;
};

exports.returnIsWide = function returnIsWide(app, isWide, drawer, drawerParent) {
  const swipeArea = document.getElementsByClassName('swipe-area')[0];
  const mobileMenuToggle = document.getElementsByClassName('mobile-menu-toggle')[0];
  if (isWide) {
    if (drawer !== null && drawer !== undefined) {
      if (app.contentWidth === '0px') { app.contentWidth = '182px'; }// eslint-disable-line no-param-reassign
      drawer.style.display = 'block';// eslint-disable-line no-param-reassign
      swipeArea.style.display = 'none';
      drawerParent.css('display', 'block');
      mobileMenuToggle.style.display = 'none';
    }
  } else { app.contentWidth = '0px'; }// eslint-disable-line no-param-reassign
  const mainP = document.getElementsByClassName('main-panel')[0];
  if (mainP !== null && mainP !== undefined) {
    mainP.style.marginRight = app.contentWidth;
  }
  return isWide;
};

exports.hiddenAlready = false;

exports.handleScreenSize = function handleScreenSize(app, isWide, drawerParent) {
  const drawer = document.getElementsByClassName('drawer')[0];
  const drawerContainer = document.getElementsByClassName('drawer-container')[0];
  const mobileMenuToggle = document.getElementsByClassName('mobile-menu-toggle')[0];
  const swipeArea = document.getElementsByClassName('swipe-area')[0];
  /* istanbul ignore else */
  if (!app.menuToggled && !isWide) {
    /* istanbul ignore else */
    if (drawer !== null && drawer !== undefined) {
      drawer.style.display = 'none';
      drawerParent.css('display', 'none');
      mobileMenuToggle.style.display = 'block';
      swipeArea.style.display = 'block';
    }
    this.hiddenAlready = true;
  } else if (app.menuToggled && !isWide && !this.hiddenAlready) {
    drawerContainer.style.display = 'none';
    mobileMenuToggle.style.display = 'block';
    this.hiddenAlready = true;
  } else if (isWide) {
    this.hiddenAlready = false;
  }
  return this.returnIsWide(app, isWide, drawer, drawerParent);
};

exports.clickFunc = function clickFunc(event) {
  const drawer = document.getElementsByClassName('drawer')[0];
  const toggleIcon = document.getElementsByClassName('mobile-menu-toggle')[0];
  /* istanbul ignore else */
  if (event.target.className !== 'menu-item') {
    document.getElementsByClassName('swipe-area')[0].style.display = 'none';
    drawer.style.display = 'none';
    $(drawer).parent().css('display', 'none');
    toggleIcon.style.display = 'block';
    document.getElementsByClassName('page-host')[0].style.overflow = 'auto';
  }
};
