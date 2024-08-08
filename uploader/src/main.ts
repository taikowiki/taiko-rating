import App from './App.svelte'

document.body.innerHTML = '';
document.querySelectorAll('style').forEach(e => e.remove())

const app = new App({
  target: document.body
})

export default app
