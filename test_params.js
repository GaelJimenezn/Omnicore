import fetch from 'node-fetch';

async function test() {
  const steamGridApiKey = 'f79ec99f279eb51e27139b56833ff0f4';
  const gameId = 5138060;

  console.log('Testing no filters:');
  const res1 = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}`, {
      headers: { 'Authorization': `Bearer ${steamGridApiKey}` }
  });
  const data1 = await res1.json();
  console.log(`NO FILTERS -> FOUND: ${data1.data?.length}`);

  console.log('Testing dimensions=600x900:');
  const res2 = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900`, {
      headers: { 'Authorization': `Bearer ${steamGridApiKey}` }
  });
  const data2 = await res2.json();
  console.log(`600x900 -> FOUND: ${data2.data?.length}`);
  
  console.log('Testing styles=alternate:');
  const res3 = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?styles=alternate`, {
      headers: { 'Authorization': `Bearer ${steamGridApiKey}` }
  });
  const data3 = await res3.json();
  console.log(`STYLES -> FOUND: ${data3.data?.length}`);
}

test();
