import type { UserConfig } from '@commitlint/types';

/** Conventional Commits, as in every repo of the project (CLAUDE.md §10). */
const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
};

export default config;
