import { AppState } from '../utils/AppState';

describe('The AppState module unit tests', () => {
	let appState;
	const roles = ['developer', 'volunteer'];
	const user = { userName: 'John Doe', _id: 'foo' };
	const userDeveloper = { userName: 'John Doe', _id: 'foo', userType: 'Developer' };
	
	beforeEach(() => {
		appState = new AppState({
			async fetch(args) {
				return { json() { return { userType: args }; } };
			}
		});
	});

  it('should set and then get the corresponding value of the user', (done) => {
    appState.setUser(user);
    appState.getUser('foo').then((returnedUser) => {
      expect(returnedUser).toEqual(user);
      done();
    });
  });

  it('should set all the roles for the developer', async (done) => {
    await appState.setUser(userDeveloper);
    await appState.checkUserRole();
    const devroles = await appState.getRoles();
    expect(devroles).toContain('developer');
    done();
  });

  it('should set and get values for the roles', (done) => {
    appState.setRoles(roles);
    const returnedRoles = appState.getRoles();
    returnedRoles.then((userRoles) => {
      expect(userRoles.indexOf('developer')).toBe(0);
      expect(userRoles.indexOf('volunteer')).toBe(1);
      done();
    });
  });
  
  it('should set the role for disabled', (done) => {
    appState.user.userStatus = 'disabled';
    appState.setRoles(roles);
    const returnedRoles = appState.getRoles();
    returnedRoles.then((userRoles) => {
      expect(userRoles.indexOf('developer')).toBe(0);
      expect(userRoles.indexOf('volunteer')).toBe(1);
      expect(userRoles.indexOf('disabled')).toBe(2);
      done();
    });
  });
  
  it('should get user id', (done) => {
		appState.getUserID = () => undefined;
		appState.user.userType = 'Librarian';
		
		appState.getUser('Librarian').then(() => {
			done();
		});
  });
  
  it('throw an error and log out user', (done) => {
    appState.getUserID = () => undefined;
    appState.checkUserRole = () => { throw new Error('error thrown for fun'); };
    
    appState.getUser('Librarian').then(() => {
      done();
    });
  });
});
