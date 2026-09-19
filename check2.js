fetch('https://mf-collections.vercel.app')
  .then(res => res.text())
  .then(html => {
    const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if(match) {
      require('fs').writeFileSync('vercel_index.html', html);
      console.log('Fetching JS:', match[1]);
      return fetch('https://mf-collections.vercel.app' + match[1]);
    }
    throw new Error('No match');
  })
  .then(res => res.text())
  .then(js => {
    require('fs').writeFileSync('vercel_bundle.js', js);
    console.log('Saved vercel_bundle.js, length:', js.length);
  })
