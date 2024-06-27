self.onmessage = function (e) {
  const number = e.data;
  const result = factorial(number);
  self.postMessage(result);
};

function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
