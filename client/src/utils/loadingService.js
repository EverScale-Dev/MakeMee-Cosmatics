let listeners = [];
let counter = 0;

function broadcast() {
  listeners.forEach((cb) => cb(counter));
}

export function subscribe(cb) {
  listeners.push(cb);
  cb(counter); // immediately call with current state
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function increment() {
  counter++;
  broadcast();
}

export function decrement() {
  counter = Math.max(0, counter - 1);
  broadcast();
}
