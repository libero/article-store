import InvalidId from '../../src/errors/invalid-id';

describe('invalid id error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new InvalidId();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new InvalidId('12345');

    expect(error.message).toBe('12345 is not a valid ID');
  });

  it('may not have an ID', async (): Promise<void> => {
    const error = new InvalidId();

    expect(error.id).toBe(undefined);
  });

  it('should have an ID', async (): Promise<void> => {
    const error = new InvalidId('12345');

    expect(error.id).toBe('12345');
  });
});
