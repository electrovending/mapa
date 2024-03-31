// Function to fetch data from Binance API
async function fetchData() {
    const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr');
    const data = await response.json();
    return data;
}

// Function to display coin data on the webpage
async function displayCoins() {
    const gainersList = document.getElementById('gainersList');
    const losersList = document.getElementById('losersList');
    gainersList.innerHTML = ''; // Clear previous data
    losersList.innerHTML = ''; // Clear previous data

    const coins = await fetchData();

    // Filtrar las monedas que más subieron y las que más bajaron
    const gainers = coins.filter(coin => parseFloat(coin.priceChangePercent) > 0);
    const losers = coins.filter(coin => parseFloat(coin.priceChangePercent) < 0);

    // Ordenar las monedas que más subieron de mayor a menor cambio porcentual
    gainers.sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));

    // Mostrar el que más subió en primer lugar
    const maxGainer = gainers.shift();
    const maxGainerSymbol = maxGainer.symbol;
    const maxGainerPriceChangePercent = parseFloat(maxGainer.priceChangePercent);
    const maxGainerElement = createCoinElement(maxGainerSymbol, maxGainerPriceChangePercent, 'gainers');
    gainersList.appendChild(maxGainerElement);

    // Mostrar las monedas que subieron, excluyendo el que más subió, en orden descendente
    gainers.forEach(coin => {
        const symbol = coin.symbol;
        const priceChangePercent = parseFloat(coin.priceChangePercent);

        const coinElement = createCoinElement(symbol, priceChangePercent, 'gainers');
        gainersList.appendChild(coinElement);
    });

    // Ordenar las monedas que bajaron de menor a mayor cambio porcentual
    losers.sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent));

    // Mostrar el que más bajó en primer lugar
    const maxLoser = losers.shift();
    const maxLoserSymbol = maxLoser.symbol;
    const maxLoserPriceChangePercent = parseFloat(maxLoser.priceChangePercent);
    const maxLoserElement = createCoinElement(maxLoserSymbol, maxLoserPriceChangePercent, 'losers', true);
    losersList.appendChild(maxLoserElement);

    // Mostrar las monedas que bajaron, excluyendo el que más bajó, en orden descendente
    losers.forEach(coin => {
        const symbol = coin.symbol;
        const priceChangePercent = parseFloat(coin.priceChangePercent);

        const coinElement = createCoinElement(symbol, priceChangePercent, 'losers', true);
        losersList.appendChild(coinElement);
    });
}

// Function to create coin element
function createCoinElement(symbol, priceChangePercent, listId, isRed = false) {
    const coinElement = document.createElement('div');
    coinElement.classList.add('coinInfo');
    if (isRed) {
        coinElement.classList.add('red');
    } else {
        coinElement.classList.add('high');
    }
    const percentChange = `${priceChangePercent.toFixed(2)}%`;
    const binanceLink = `https://www.binance.com/en/futures/${symbol.toUpperCase()}USDT`;
    coinElement.innerHTML = `
        <a href="${binanceLink}" target="_blank" class="coinLink">
            <span class="symbol">${symbol}</span>
            <span class="percentChange">${percentChange}</span>
        </a>
    `;
    return coinElement;
}

// Call the displayCoins function initially and every 5 seconds for real-time updates
displayCoins();
setInterval(displayCoins, 5000);
