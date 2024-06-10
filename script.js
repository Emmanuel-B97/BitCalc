const baseURL = 'https://api.coingecko.com/api/v3';

// Função para obter o preço atual do Bitcoin na moeda selecionada
async function getBTCPrice(currency) {
    try {
        const response = await axios.get(`${baseURL}/simple/price?ids=bitcoin&vs_currencies=${currency}`);
        return response.data.bitcoin[currency];
    } catch (error) {
        console.error('Erro ao obter preço do Bitcoin:', error);
        return null;
    }
}

// Função para converter o valor inserido em moeda local para satoshis
async function convertToSatoshis(valor, currency) {
    const btcPrice = await getBTCPrice(currency);

    if (!btcPrice) {
        return null; // Caso não seja possível obter o preço do Bitcoin
    }

    // Convertendo moeda local para Bitcoin
    const btcAmount = valor / btcPrice;

    // Convertendo Bitcoin para satoshis
    const satoshis = btcAmount * 100000000; // 1 Bitcoin = 100.000.000 satoshis
    return satoshis;
}

document.addEventListener('DOMContentLoaded', async () => {
    const satoshisResult = document.getElementById('result');
    const calcButton = document.getElementById('calculate');
    const btcAmountInput = document.getElementById('btcAmount');
    const currencySelect = document.getElementById('currency');
    const conversionInfo = document.getElementById('conversionInfo');

    calcButton.addEventListener('click', async () => {
        const valor = parseFloat(btcAmountInput.value);
        const currency = currencySelect.value;

        if (isNaN(valor) || valor <= 0) {
            satoshisResult.innerHTML = "Por favor, insira um valor válido.";
            return;
        }

        const satoshis = await convertToSatoshis(valor, currency);
        const btcPrice = await getBTCPrice(currency);

        if (satoshis !== null) {
            // Exibe o resultado com precisão decimal
            satoshisResult.innerHTML = `Quantidade em satoshis: ${satoshis.toFixed(2)}`;
            conversionInfo.innerHTML = `1 Bitcoin = ${btcPrice.toFixed(2)} ${currency.toUpperCase()}`;
        } else {
            satoshisResult.innerHTML = "Erro ao converter valor. Por favor, tente novamente mais tarde.";
            conversionInfo.innerHTML = "";
        }
    });
});