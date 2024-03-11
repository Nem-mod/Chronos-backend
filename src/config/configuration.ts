import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_NAME: string = `config.yaml`;

export default () => {
  return yaml.load(readFileSync(YAML_CONFIG_NAME, `utf-8`)) as Record<
    string,
    any
  >;
};
