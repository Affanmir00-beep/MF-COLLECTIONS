fetch('https://mf-collections.vercel.app/assets/index-D66C2aqE.js')
  .then(res => res.text())
  .then(js => {
    const urls = js.match(/https:\/\/mf-collections\.onrender\.com[^\s\"\'\`]*/g);
    console.log('Found URLs:', [...new Set(urls)]);
  })
