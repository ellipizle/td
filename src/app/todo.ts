export class Todo {
  id: number;
  title = '';
  complete = false;
  timeRemaining: number;
  timeSpent: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
