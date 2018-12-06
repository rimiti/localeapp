import { expect } from 'chai';
import path from 'path';
import fs from 'fs';
import { get } from 'lodash';
import toFolders from '../src/utils/to-folders';

describe('toFolders(rootFolder, target, locale)', () => {
  let en;
  let desiredManifest;
  let desiredQuick;

  before(() => {
    en = fs.readFileSync(path.resolve(__dirname, 'en_to.yml'), 'utf8');
    desiredManifest = {
      "order": "{{order}}",
      "studio": "{{studio}}"
    };
    desiredQuick = {
      "quick": "Veloce %{cammina}",
      "service": "Servizio %{ciao}",
      "haha": "fsdflkj"
    };
  });

  it('Should take the contents of the target file and update the manifests (root)', () => {
    const sections = toFolders(path.resolve(__dirname, './mock/config/generated/sections'), en, 'en_to');
    const updatedManifest = get(sections, 'manifest');
    const updatedQuick = get(sections, 'order.quick-services.index');
    expect(updatedManifest).to.deep.equal(desiredManifest);
    expect(updatedQuick).to.deep.equal(desiredQuick);
  });
});
