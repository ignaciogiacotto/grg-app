import axios from 'axios';

// --- Interfaces para definir la estructura de la respuesta de la API ---
interface PayGroup {
  fx_rate: number;
  // ... otros campos que no necesitamos
}

interface ServiceGroup {
  pay_groups: PayGroup[];
  // ... otros campos
}

interface ApiResponse {
  services_groups: ServiceGroup[];
  // ... otros campos
}

// --- Mapa de países para obtener los parámetros correctos ---
const countryMap: { [key: string]: { currency: string; country: string } } = {
  PY: { currency: 'PYG', country: 'PY' },
  US: { currency: 'USD', country: 'US' },
  ES: { currency: 'EUR', country: 'ES' },
  PE: { currency: 'PEN', country: 'PE' },
  BO: { currency: 'BOB', country: 'BO' },
  CL: { currency: 'CLP', country: 'CL' },
};

// --- Función principal del servicio ---

/**
 * Obtiene la tasa de cambio para un corredor específico (ej. ARS -> PYG)
 * llamando a la API interna de Western Union.
 * @param destinationCurrency - El código ISO de la moneda de destino (ej. "PYG").
 * @param destinationCountry - El código ISO del país de destino (ej. "PY").
 * @returns La tasa de cambio.
 */
async function fetchRate(destinationCurrency: string, destinationCountry: string): Promise<number> {
  const apiUrl = 'https://www.westernunion.com/wuconnect/prices/catalog';

  // Las cabeceras necesarias para que la API acepte la petición
  const headers = {
    'accept': '*/*',
    'accept-language': 'es-419,es-US;q=0.9,es;q=0.8,en;q=0.7',
    'cookie': 'AKCountry=AR; AKZip=; AKRegioncode=; AKAreacode=; AKCounty=; AKCity=BANFIELD; optimizelyEndUserId=oeu1757193501320r0.007799990594966055; s_ecid=MCMID%7C37788989448696032320259321333215171849; affiliate_src_code=; user_txn_state=0:1757193502154; _gcl_au=1.1.598862839.1757193503; cjConsent=MHxOfDB8Tnww; _tt_enable_cookie=1; _ttp=01K4GEA04VVVQ0AXTNK4DCVYK3_.tt.1; cjUser=c1cb0e2e-8b7e-4f86-93bd-c38ba7e4d83a; afUserId=a8f31095-a518-4eec-8298-be2ddaf878f5-p; AF_SYNC=1757193503778; __qca=P1-549e5d86-2ca6-4369-826e-42d1a865250d; optimizelySession=0; rxVisitor=1757197012434RHP9KE4F31DFFM046678KF4UFQ9A5MF8; fp_token_7c6a6574-f011-4c9a-abdd-9894a102ccef=x6/+gt5laEXmrzRF5iiNN4k+GhxIMPnZBs0AliXKc/w=; enableNextGenWeb=true; txnR4ExperienceForAR=true; QuantumMetricUserID=d1144286c50f9b6d870b77c1bddb7112; amplitude_id_4aec879ef8bf1823486c4338537ec441westernunion.com=eyJkZXZpY2VJZCI6Ijk4Y2FhZjBjLTI3NWEtYzFiMy04NDY3LTYzN2ViYjkyY2YyNyIsInVzZXJJZCI6bnVsbCwib3B0T3V0IjpmYWxzZSwic2Vzc2lvbklkIjoxNzU3MTk2OTkxMzI0LCJsYXN0RXZlbnRUaW1lIjoxNzU3MTk4Mjc2MjkzLCJldmVudElkIjo1OCwiaWRlbnRpZnlJZCI6NDksInNlcXVlbmNlTnVtYmVyIjoxMDd9; AK_TLS_Version=tls1.3; AKA_A2=A; resolution_height=800; resolution_width=1280; is_tablet=false; is_mobile=false; CountryCode=ar; LangCode=es; BIGipServerpool_origin-digital-res.westernunion.com=!Lx1cndtHUr5KVKq7L4DzxO+TyoJycNo9l+8TZTucedIBV45q1RBhQGU/Gzv3tTwzuJWXOahua5+F++I=; ak_bmsc=6F96C9113277551BB2E0208A579FF121~000000000000000000000000000000~YAAQ1fcSAuqhntKYAQAALedcKx00NwmQIjDTimY1J+q2P85xxO38QGmcEiG6icovVBRPtz38/xtnJJNsW36utuBbotSlw0rLiDVt46NpeTBLQDUWhCClkpc+ALYY5OLgM0Q/gcedtgVuGugSEDmR13gUDs016F7OwXpSfVQSbXJrv2fIaiHno6Tich7OyBHXjg0rMZKDd2b/lUMRGxb05+9L60Og6Sgb0y6aw2eb2szMb02o7iLFIDvo6i3KfZ9VW8buzifRfmxapp2DAhkfvnqFLa52z2jh460aywrXvmFt9GYy+2gUNWM5TVz7CS7uKULQB4/4s1hLCdlyuk+jRi2KGagTMKGC03hnWCY/AjIudoCjYCsxI2hN805G8P9/WqoEPULqNG9F1Pntvd4g1fw07RZSVBvrDEgd+YY2gst5IuC1qbdDcPGF3r7QSXRLvUyo+uCD2FnOac/QN/Bbu1VLLU8=; AMCVS_AACD3BC75245B4940A490D4D%40AdobeOrg=1; ... [truncated]',
    'partnerid': 'R3WEB9Z00',
    'referer': 'https://www.westernunion.com/ar/es/currency-converter/ars-to-pyg-rate.html',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
  };

  // El cuerpo de la petición, simulando una consulta para obtener la tasa
  const payload = {
    header_request: { version: "0.5", request_type: "PRICECATALOG" },
    receiver: {
      curr_iso3: destinationCurrency,
      cty_iso2_ext: destinationCountry,
      cty_iso2: destinationCountry
    },
    sender: {
      client: "WUCOM",
      channel: "WWEB",
      funds_in: "EB",
      curr_iso3: "ARS",
      cty_iso2_ext: "AR",
      send_amount: "1000" // Usamos un monto fijo, la tasa no debería cambiar
    }
  };

  try {
    const { data } = await axios.post<ApiResponse>(apiUrl, payload, { headers });

    // Navegamos la estructura del JSON para encontrar la tasa
    const rate = data?.services_groups?.[0]?.pay_groups?.[0]?.fx_rate;

    if (rate) {
      return rate;
    } else {
      throw new Error(`Could not extract fx_rate for ${destinationCurrency} from API response.`);
    }
  } catch (error) {
    console.error(`Error fetching rate for ${destinationCurrency}:`, error);
    throw new Error(`Failed to fetch exchange rate for ${destinationCurrency}.`);
  }
}

/**
 * Exporta la función principal que obtiene la tasa de cambio para un país específico.
 * @param countryCode - El código de dos letras del país (ej. "PY", "US").
 */
export const getExchangeRates = async (countryCode: string): Promise<{ rate: number }> => {
  const countryParams = countryMap[countryCode.toUpperCase()];

  if (!countryParams) {
    throw new Error(`Invalid country code: ${countryCode}`);
  }

  try {
    const rate = await fetchRate(countryParams.currency, countryParams.country);
    return { rate };
  } catch (error) {
    console.error(`Error fetching rate for ${countryCode}:`, error);
    throw error; // Re-lanza el error para que el controlador lo atrape
  }
};