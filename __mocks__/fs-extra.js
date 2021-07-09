const fs = jest.createMockFromModule('fs-extra');

fs.mkdirSync = jest.fn();

fs.copy = jest.fn();

fs.readJsonSync = jest.fn(() => ({
	scripts: {
		start: '',
		build: '',
	}
}));

fs.writeJsonSync = jest.fn();

module.exports = fs;