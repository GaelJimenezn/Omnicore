
async function test() {
  const rawgApiKey = '27316a9d4cea4450b96101ca584fb321';
  const steamGridApiKey = 'f79ec99f279eb51e27139b56833ff0f4';

  const res = await fetch(`https://api.rawg.io/api/games?key=${rawgApiKey}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=5`);
  const data = await res.json();
  
  for (const g of data.results) {
    console.log(`RAWG Game: ${g.name}`);
    const searchRes = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(g.name)}`, {
        headers: { 'Authorization': `Bearer ${steamGridApiKey}` }
    });
    const searchData = await searchRes.json();
    if (!searchData.success || searchData.data.length === 0) {
        console.log(`  -> SteamGridDB NO RESULTS for ${g.name}`);
        continue;
    }
    const gameId = searchData.data[0].id;
    console.log(`  -> SGDB Game ID: ${gameId}`);
    
    const gridRes = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900,342x482,460x215&styles=alternate,official,material,white_logo,no_logo`, {
        headers: { 'Authorization': `Bearer ${steamGridApiKey}` }
    });
    const gridData = await gridRes.json();
    if (gridData.success && gridData.data.length > 0) {
        console.log(`  -> FOUND GRIDS: ${gridData.data.length}`);
    } else {
        console.log(`  -> NO GRIDS for ${gameId}`);
    }
  }
}

test();
