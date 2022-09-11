// Discrete Fourier Transform
function dft(values) {
  const N = values.length;
  let transform = [];
  
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI/N) * k*n;
      
      const a = values[n].x;
      const b = values[n].y;
      const c = cos(phi);
      const d = -sin(phi);
      
      re += a*c - b*d;
      im += a*d + b*c;
    }
    re /= N;
    im /= N;
    transform[k] = { freq: k, amp: sqrt(re*re + im*im), phase: atan2(im, re) };
  }
  
  transform.sort((a, b) => b.amp - a.amp);
  return transform;
}