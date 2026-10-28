import axe from 'axe-core';

/**
 * Runs axe-core on a rendered container and fails the test on any violation.
 *
 * @remarks
 * Used by the design system tests (CLAUDE.md §2.4). `color-contrast` is skipped because
 * jsdom does not compute styles; contrast is checked in the e2e tests with a real browser.
 *
 * @param container - Element returned by `render`.
 */
export const expectNoA11yViolations = async (container: Element): Promise<void> => {
  const { violations } = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
};
