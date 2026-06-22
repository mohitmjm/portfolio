/* Shared configuration for the Python compiler page. */

// Hard ceiling for a single execution before the worker is force-terminated.
export const RUN_TIMEOUT_MS = 15000;

export const DEFAULT_CODE = `# Welcome to the future of coding. Press Run (Ctrl+Enter).

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

for i in range(1, 6):
    print(f"{i} squared is {i * i}")
`;

export const TEMPLATES = [
  {
    id: 'hello',
    label: 'Hello World',
    code: `print("Hello, World!")\n`,
  },
  {
    id: 'fibonacci',
    label: 'Fibonacci',
    code: `def fib(n):
    a, b = 0, 1
    out = []
    for _ in range(n):
        out.append(a)
        a, b = b, a + b
    return out

print(fib(15))
`,
  },
  {
    id: 'primes',
    label: 'Prime Sieve',
    code: `def primes_below(n):
    sieve = [True] * n
    sieve[0:2] = [False, False]
    for i in range(2, int(n ** 0.5) + 1):
        if sieve[i]:
            for j in range(i * i, n, i):
                sieve[j] = False
    return [i for i, p in enumerate(sieve) if p]

print(primes_below(50))
`,
  },
  {
    id: 'bubble',
    label: 'Bubble Sort',
    code: `def bubble_sort(arr):
    arr = arr[:]
    for i in range(len(arr)):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
`,
  },
  {
    id: 'oop',
    label: 'Classes & OOP',
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

for a in [Animal("Generic"), Dog("Rex")]:
    print(a.speak())
`,
  },
];

export function formatTime(seconds) {
  if (seconds == null) return '—';
  if (seconds < 0.001) return '<1';
  if (seconds < 1) return (seconds * 1000).toFixed(0);
  return (seconds * 1000).toFixed(0);
}

export function formatBytes(bytes) {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes}`;
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1);
  return (bytes / (1024 * 1024)).toFixed(2);
}
