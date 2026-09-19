fetch('https://mf-collections.vercel.app')
  .then(res => res.text())
  .then(html => {
    const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if(match) {
      return fetch('https://mf-collections.vercel.app' + match[1]);
    }
  })
  .then(res => res.text())
  .then(js => {
    console.log('Includes localhost?', js.includes('localhost:5000'));
    const urls = js.match(/https:\/\/mf-collections\.onrender\.com[^\s\"\'\`]*/g);
    console.log('Found URLs:', [...new Set(urls)]);
  })
