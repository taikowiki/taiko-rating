import App from './App.svelte'

document.body.innerHTML = '';
document.querySelectorAll('style').forEach(e => e.remove());
document.body.style.backgroundColor = 'white';

const app = new App({
  target: document.body
})

export default app
