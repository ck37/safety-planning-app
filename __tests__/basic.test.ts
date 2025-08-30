/**
 * Basic Test Suite
 * Simple tests to verify the test environment is working
 */

describe('Basic Test Suite', () => {
  it('should run basic JavaScript tests', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect(true).toBeTruthy();
  });

  it('should handle arrays and objects', () => {
    const arr = [1, 2, 3];
    const obj = { name: 'test', value: 42 };
    
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    
    expect(result).toBe('success');
  });

  it('should validate TypeScript types', () => {
    interface TestInterface {
      id: number;
      name: string;
      active?: boolean;
    }

    const testObj: TestInterface = {
      id: 1,
      name: 'Test Object'
    };

    expect(testObj.id).toBe(1);
    expect(testObj.name).toBe('Test Object');
    expect(testObj.active).toBeUndefined();
  });
});
