const fs = require('fs-extra');
const path = require('path');

jest.mock('child_process');
jest.mock('fs-extra');

describe('stops if no argument is passed', () => {
  const mockError = jest.spyOn(console, 'error').mockImplementation(str => str);
  process.argv = [];

  beforeEach(() => {
    require('../scripts/execute');
  });

  it('returns with error on console', () => {
    expect(mockError.mock.calls.length).toEqual(1);
    expect(mockError).toHaveBeenCalledWith('usage -- provide a name for the project');
  });

  it('does not call fs mkdirSync', () => {
    expect(fs.mkdirSync.mock.calls.length).toEqual(0);
  });

  it('does not call fs copy', () => {
    expect(fs.copy.mock.calls.length).toEqual(0);
  });
});