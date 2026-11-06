import { describe, it, expect } from 'vitest';

//goups test  under 'Todo logic test'
describe('Todo logic test', () => {
    //names and runs the test scenatio
  it('toggles completion status correctly', () => {
    //creates test task not completed
    const item = { id: 1, text: 'test task', completed: false, priority: 'High' as const };
    //coppies the task but this time completed as true
    const toggled = { ...item, completed: !item.completed };

    //checks if toggled.complete is true. If yes, the test passes.
    expect(toggled.completed).toBe(true);
  });
});