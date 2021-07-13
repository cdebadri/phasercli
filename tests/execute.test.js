const {
	npmInitProcess,
	npmInstallProcess,
	npmAddScripts,
	copyScripts,
} = require('../scripts/phasercli');

jest.mock('../scripts/phasercli');

describe('testing execute', () => {
	process.argv[2] = 'trial';

	beforeEach(() => {
		require('../scripts/execute');
	})
	
	it('calls npmInitProcess', () => {
		expect(npmInitProcess).toHaveBeenCalledTimes(1);
	});

	it('calls npmInstallProcess', () => {
		expect(npmInstallProcess).toHaveBeenCalledTimes(2);
	});

	it('calls copyScripts', () => {
		expect(copyScripts).toHaveBeenCalledTimes(1);
	});

	it('calls npmAddScripts', () => {
		expect(npmAddScripts).toHaveBeenCalledTimes(1);
	});
});