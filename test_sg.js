import https from 'https';

const apiKey = 'f79ec99f279eb51e27139b56833ff0f4';
const gameId = 5138060; // Baldur's Gate 3

https.get(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900`, {
  headers: { 'Authorization': `Bearer ${apiKey}` }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Search Response:', JSON.parse(data).data[0]);
  });
}).on('error', err => console.error(err));
