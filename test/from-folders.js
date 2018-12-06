import { expect } from 'chai';
import path from 'path';
import fs from 'fs';
import fromFolders from '../src/utils/from-folders';

describe('FromFolders(rootFolder, locale)', () => {
  describe('When the structure is complex, contains single keys, multiple folders', () => {
    const fullRootPath = path.resolve(__dirname, './mock/config/full/sections');
    const locale = 'en_from';

    let en;
    before(() => {
      en = fs.readFileSync(path.resolve(__dirname, `${locale}.yml`), 'utf8');
    });

    it('The generated yml file should contain all contents of the rootFolder', () => {
      expect(fromFolders(fullRootPath, locale)).to.equal(en);
    });
  });

  describe('When the structure is the most simple i.e. only 1 yml file at the root', () => {
    const fullRootPath = path.resolve(__dirname, './mock/config/simple');

    let en;
    before(() => {
      en = fs.readFileSync(path.resolve(__dirname, 'simple.yml'), 'utf8');
    });

    it('The generated yml file should contain all contents of the rootFolder', () => {
      expect(fromFolders(fullRootPath, 'en')).to.equal(en);
    });
  });
});
