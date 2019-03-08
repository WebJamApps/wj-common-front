const au = require('../utils/appUtils');

describe('the appUtils', () => {
  it('checks for an authenticated user but has error on get token payload on checkUser', async () => {
    try {
      const cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() {
            return true;
          }
        }
      });
      expect(cb).toBe('bad token');
    } catch (e) {
      throw e;
    }
  });
  it('assigned the role of an authenticated user on checkUser', async () => {
    try {
      const cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() {
            return true;
          },
          getTokenPayload() {
            return {
              sub: '123'
            };
          }
        },
        appState: {
          getUser() {
            return {
              usertype: 'charity'
            };
          }
        }
      });
      expect(cb).toBe(true);
    } catch (e) {
      throw e;
    }
  });
  it('does nothing is user is not authenticated on checkUser', async () => {
    try {
      const cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() {
            return false;
          },
          getTokenPayload() {
            return {
              sub: '123'
            };
          }
        },
        appState: {
          getUser() {
            return {
              usertype: 'charity'
            };
          }
        }
      });
      expect(cb).toBe(true);
    } catch (e) {
      throw e;
    }
  });
  it('does nothing if token is null', (done) => {
    window.localStorage = {
      getItem(key) {
        expect(key).toBe('aurelia_id_token');
        return null;
      }
    };
    const cb = au.checkIfLoggedIn();
    expect(cb).toBe(false);
    done();
  });
  it('logs out if token is invalid', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    const cb = au.checkIfLoggedIn({
      logout() {},
      auth: {
        getTokenPayload() {
          return Promise.reject(new Error('bad token'));
        }
      }
    });
    expect(cb).toBe(false);
    done();
  });
  it('navigates to dashboard if token is good', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    const cb = au.checkIfLoggedIn({
      router: {
        navigate() {}
      },
      logout() {},
      auth: {
        getTokenPayload() {
          return true;
        },
        setToken() {}
      }
    });
    expect(cb).toBe(true);
    done();
  });
  it('does nothing is user is not defined on checkUser', async () => {
    try {
      const cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() {
            return true;
          },
          getTokenPayload() {
            return {
              sub: '123'
            };
          }
        },
        appState: {
          getUser() {
            return Promise.resolve();
          }
        }
      });
      expect(cb).toBe(true);
    } catch (e) {
      throw e;
    }
  });
  it('checks if widescreen and returns false', (done) => {
    const app = {
      menuToggled: false,
      contentWidth: '100px'
    };
    const drawer = {
      style: {
        display: 'none'
      }
    };
    const mobileMenuToggle = {
      style: {
        display: 'none'
      }
    };
    const cb = au.returnIsWide(app, false, drawer, mobileMenuToggle);
    expect(cb).toBe(false);
    done();
  });
  it('checks if widescreen and returns true', (done) => {
    document.body.innerHTML = '<div class="swipe-area"></div><div class="main-panel">'
      + '</div><div class="drawer-parent"><div class="drawer"></div><button class="mobile-menu-toggle"></button></div>';
    const app = {
      menuToggled: false,
      contentWidth: '100px'
    };
    const drawer = document.getElementsByClassName('drawer')[0];
    const drawerParent = {
      css() {}
    };
    const cb = au.returnIsWide(app, true, drawer, drawerParent);
    expect(cb).toBe(true);
    done();
  });
  it('handles the screen size functionality', (done) => {
    document.body.innerHTML = '<div class="mobile-menu-toggle"><div class="swipe-area"></div><div class="drawer"></div></div>';
    au.handleScreenSize({
      menuToggled: false
    }, false, {
      style: {
        display: ''
      },
      css() {}
    }, 'returnIsWide');
    expect(document.getElementsByClassName('swipe-area')[0].style.display).toBe('block');
    done();
  });
  it('handles the screen size functionality when not hiddenAlready and menuToggled', (done) => {
    au.hiddenAlready = false;
    document.body.innerHTML = '<div class="mobile-menu-toggle"><div class="swipe-area"></div><div class="drawer">'
    + '</div></div><div class="drawer-container"></div>';
    au.handleScreenSize({
      menuToggled: true
    }, false, {
      style: {
        display: ''
      },
      css() {}
    }, 'returnIsWide');
    expect(au.hiddenAlready).toBe(true);
    done();
  });
  it('handles screen size when menu is toggled', (done) => {
    au.returnIsWide = function returnIsWide() {
      return true;
    };
    document.body.innerHTML = '<div class="mobile-menu-toggle page-host"><div class="swipe-area"></div><div class="drawer"></div></div>';
    const cb = au.handleScreenSize({
      menuToggled: true
    }, true, null, 'returnIsWide');
    expect(cb).toBe(true);
    done();
  });
  it('provides a click function', (done) => {
    window.$ = a => ({// eslint-disable-line no-unused-vars
      parent() {
        return {
          css() {} // eslint-disable-line no-shadow
        };
      }
    });
    document.body.innerHTML = '<div class="mobile-menu-toggle page-host"><div class="swipe-area"></div><div class="drawer"></div></div>';
    au.clickFunc({
      target: {
        className: 'menu'
      }
    });
    expect(document.getElementsByClassName('mobile-menu-toggle')[0].style.display).toBe('block');
    done();
  });
  it('when is wide it sets the content width', (done) => {
    document.body.innerHTML = '<div class="mobile-menu-toggle page-host"><div class="swipe-area"></div><div class="drawer"></div></div>';
    const cb = au.returnIsWide({
      contentWidth: '0px'
    }, true, {
      style: {
        display: ''
      }
    }, {
      css() {}
    });
    expect(cb).toBe(true);
    done();
  });
  it('when is wide it sets content width to 0', (done) => {
    document.body.innerHTML = '<div class="mobile-menu-toggle page-host"><div class="swipe-area"></div><div class="drawer"></div></div>';
    const cb = au.returnIsWide({
      contentWidth: '182px'
    }, true, null, {
      css() {}
    });
    expect(cb).toBe(true);
    done();
  });
});
