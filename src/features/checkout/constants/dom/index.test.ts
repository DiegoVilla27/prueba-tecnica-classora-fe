/**
 * @fileoverview Unit tests for `focusScanInput`.
 */
import { waitFor } from '@testing-library/react';
import { focusScanInput, SCAN_INPUT_ID } from '.';

describe('Checkout: focusScanInput', () => {
  it('should focus the code field on the next frame', async () => {
    // Arrange
    const input = document.createElement('input');
    input.id = SCAN_INPUT_ID;
    document.body.append(input);

    // Act
    focusScanInput();

    // Assert
    await waitFor(() => expect(input).toHaveFocus());
    input.remove();
  });
});
