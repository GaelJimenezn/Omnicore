const https = require('https');

function fetchJson(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: "Parse error", data });
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  const apiKey = 'f79ec99f279eb51e27139b56833ff0f4';
  const gameName = 'Atomic Heart';
  console.log('Searching for:', gameName);
  
  const searchRes = await fetchJson(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameName)}`, { 'Authorization': `Bearer ${apiKey}` });
  console.log('Search res:', JSON.stringify(searchRes).substring(0, 200));
  
  if (!searchRes.success || searchRes.data.length === 0) return console.log('No game found');
  const gameId = searchRes.data[0].id;
  console.log('Game ID:', gameId);
  
  const gridRes = await fetchJson(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900&styles=alternate,official,white_logo,material`, { 'Authorization': `Bearer ${apiKey}` });
  console.log('Grid res success:', gridRes.success, 'count:', gridRes.data ? gridRes.data.length : 0);
  if (gridRes.data && gridRes.data.length > 0) {
    console.log('First grid:', gridRes.data[0].url);
  }
}

test();
