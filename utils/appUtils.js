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

exports.returnIsWideCLC = function returnIsWide(app, isWide, drawer, drawerParent) {
  const headerText = document.getElementsByClassName('header-text')[0];
  const subT = document.getElementsByClassName('subTitle')[0];
  const elcaLogo = document.getElementById('elcaLogo');
  if (isWide && headerText) {
    headerText.style.fontSize = '34px';
    subT.style.maxWidth = '100%';
    if (elcaLogo !== null) {
      elcaLogo.style.width = '340px';
      elcaLogo.style.paddingTop = '30px';
    }
  }
  if (isWide && drawer) {
    app.contentWidth = app.contentWidth === '0px' ? '220px' : app.contentWidth;// eslint-disable-line no-param-reassign
    drawer.style.display = 'block';// eslint-disable-line no-param-reassign
    document.getElementsByClassName('swipe-area')[0].style.display = 'none';
    drawerParent.css('display', 'block');
    document.getElementsByClassName('mobile-menu-toggle')[0].style.display = 'none';
    document.getElementsByClassName('nav-list')[0].style.top = '91px';
  } else if (headerText) {
    headerText.style.fontSize = '24px';
    subT.style.maxWidth = '80%';
    document.getElementsByClassName('nav-list')[0].style.top = '0px';
    if (elcaLogo !== null) {
      elcaLogo.style.width = '290px';
      elcaLogo.style.paddingTop = '30px';
      elcaLogo.style.marginLeft = '-2px';
    }
    app.contentWidth = '0px';// eslint-disable-line no-param-reassign
  } else {
    app.contentWidth = '0px';// eslint-disable-line no-param-reassign
  }
  const mainP = document.getElementsByClassName('main-panel')[0];
  if (mainP !== null && mainP !== undefined) { mainP.style.marginRight = app.contentWidth; }
  return isWide;
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

exports.handleScreenSizeCLC = function handleScreenSize(app, isWide, drawerParent) {
  const drawer = document.getElementsByClassName('drawer')[0];
  const drawerContainer = document.getElementsByClassName('drawer-container')[0];
  const mobileMenuToggle = document.getElementsByClassName('mobile-menu-toggle')[0];
  const swipeArea = document.getElementsByClassName('swipe-area')[0];
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
  return this.returnIsWideCLC(app, isWide, drawer, drawerParent);
};

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
