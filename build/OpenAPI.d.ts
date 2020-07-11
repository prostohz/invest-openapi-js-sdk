import 'isomorphic-fetch';
import { CandleResolution, Candles, Currencies, MarketInstrument, MarketInstrumentList, MarketOrderRequest, Operations, Order, Orderbook, PlacedLimitOrder, PlacedMarketOrder, Portfolio, PortfolioPosition, Response, SandboxSetCurrencyBalanceRequest, SandboxSetPositionBalanceRequest, LimitOrderRequest, UserAccounts } from './domain';
import { CandleStreaming, Depth, InstrumentId, Interval, OrderbookStreaming, FIGI } from './types';
export * from './types';
export * from './domain';
declare type OpenApiConfig = {
    apiURL: string;
    socketURL: string;
    secretToken: string;
    brokerAccountId?: string;
};
export default class OpenAPI {
    private _streaming;
    private _sandboxCreated;
    private _currentBrokerAccountId;
    private readonly apiURL;
    private readonly secretToken;
    private readonly authHeaders;
    /**
     *
     * @param apiURL REST api url см [документацию](https://tinkoffcreditsystems.github.io/invest-openapi/env/)
     * @param socketURL Streaming api url см [документацию](https://tinkoffcreditsystems.github.io/invest-openapi/env/)
     * @param secretToken токен доступа см [получение токена доступа](https://tinkoffcreditsystems.github.io/invest-openapi/auth/)
     * @param brokerAccountId номер счета (по умолчанию - Тинькофф)
     */
    constructor({ apiURL, socketURL, secretToken, brokerAccountId }: OpenApiConfig);
    /**
     * Запрос к REST
     */
    private makeRequest;
    /**
     * Регистрация песочницы
     */
    private sandboxRegister;
    /**
     * Метод возвращает текущий номер счета (*undefined* - значение по умолчанию для счета Тинькофф).
     */
    getCurrentAccountId(): string | undefined;
    /**
     * Метод для сохранения номера счета по умолчанию.
     * @param brokerAccountId - Номер счета. Для счета Тинькофф можно также передать значение *undefined*.
     */
    setCurrentAccountId(brokerAccountId: string | undefined): void;
    /**
     * Метод для очистки песочницы
     */
    sandboxClear(): Promise<any>;
    /**
     * Метод для задания баланса по бумагам
     * @param params см. описание типа
     */
    setPositionBalance(params: SandboxSetPositionBalanceRequest): Promise<Response<void>>;
    /**
     * Метод для задания баланса по валютам
     * @param params см. описание типа
     */
    setCurrenciesBalance(params: SandboxSetCurrencyBalanceRequest): Promise<Response<void>>;
    /**
     * Метод для получение портфеля цб
     */
    portfolio(): Promise<Response<Portfolio>>;
    /**
     * Метод для получения валютных активов клиента
     */
    portfolioCurrencies(): Promise<Response<Currencies>>;
    /**
     * Метод для получение данных по инструменту в портфеле
     * @param params см. описание типа
     */
    instrumentPortfolio(params: InstrumentId): Promise<Response<PortfolioPosition | null>>;
    /**
     * Метод для выставления заявки
     * @param figi идентификатор инструмента
     * @param lots количество лотов для заявки
     * @param operation тип заявки
     * @param price цена лимитной заявки
     */
    limitOrder({ figi, lots, operation, price, }: LimitOrderRequest & FIGI): Promise<Response<PlacedLimitOrder>>;
    /**
     * Метод для выставления заявки
     * @param figi идентификатор инструмента
     * @param lots количество лотов для заявки
     * @param operation тип заявки
     * @param price цена лимитной заявки
     */
    marketOrder({ figi, lots, operation }: MarketOrderRequest & FIGI): Promise<Response<PlacedMarketOrder>>;
    /**
     * Метод для отмены активных заявок
     * @param orderId идентифткатор заявки
     */
    cancelOrder({ orderId }: {
        orderId: string;
    }): Promise<Response<void>>;
    /**
     * Метод для получения всех активных заявок
     */
    orders(): Promise<Response<Order[]>>;
    /**
     * Метод для получения всех доступных валютных инструментов
     */
    currencies(): Promise<Response<MarketInstrumentList>>;
    /**
     * Метод для получения всех доступных валютных ETF
     */
    etfs(): Promise<Response<MarketInstrumentList>>;
    /**
     * Метод для получения всех доступных облигаций
     */
    bonds(): Promise<Response<MarketInstrumentList>>;
    /**
     * Метод для получения всех доступных акций
     */
    stocks(): Promise<Response<MarketInstrumentList>>;
    /**
     * Метод для получения операций по цб по инструменту
     * @param from Начало временного промежутка в формате ISO 8601
     * @param to Конец временного промежутка в формате ISO 8601
     * @param figi Figi-идентификатор инструмента
     */
    operations({ from, to, figi }: {
        from: string;
        to: string;
        figi?: string;
    }): Promise<Response<Operations>>;
    /**
     * Метод для получения исторических свечей по FIGI
     * @param from Начало временного промежутка в формате ISO 8601
     * @param to Конец временного промежутка в формате ISO 8601
     * @param figi Figi-идентификатор инструмента
     * @param interval интервал для свечи
     */
    candlesGet({ from, to, figi, interval, }: {
        from: string;
        to: string;
        figi: string;
        interval?: CandleResolution;
    }): Promise<Response<Candles>>;
    /**
     * Метод для получение стакана
     * @param figi Figi-идентификатор инструмента
     * @param depth
     */
    orderbookGet({ figi, depth }: {
        figi: string;
        depth?: Depth;
    }): Promise<Response<Orderbook>>;
    /**
     * Метод для поиска инструментов по figi или ticker
     * @param params { figi или ticker }
     */
    search(params: InstrumentId): Promise<Response<MarketInstrumentList>>;
    /**
     * Метод для поиска инструмента по figi или ticker
     * @param params { figi или ticker }
     */
    searchOne(params: InstrumentId): Promise<Response<MarketInstrument | null>>;
    /**
     * Метод для подписки на данные по стакану инструмента
     * @example
     * ```typescript
     * const { figi } = await api.searchOne({ ticker: 'AAPL' });
     * const unsubFromAAPL = api.orderbook({ figi }, (ob) => { console.log(ob.bids) });
     * // ... подписка больше не нужна
     * unsubFromAAPL();
     * ```
     * @param figi идентификатор инструмента
     * @param depth
     * @param cb функция для обработки новых данных по стакану
     * @return функция для отмены подписки
     */
    orderbook({ figi, depth }: {
        figi: string;
        depth?: Depth;
    }, cb?: (x: OrderbookStreaming) => any): () => void;
    /**
     * Метод для подписки на данные по свечному графику инструмента
     * @example см. метод [[orderbook]]
     * @param figi идентификатор инструмента
     * @param interval интервал для свечи
     * @param cb функция для обработки новых данных по свечи
     * @return функция для отмены подписки
     */
    candle({ figi, interval }: {
        figi: string;
        interval?: Interval;
    }, cb?: (x: CandleStreaming) => any): () => void;
    /**
     * Метод для подписки на данные по инструменту
     * @example см. метод [[orderbook]]
     * @param figi идентификатор инструмента
     * @param cb функция для обработки новых данных по инструменту
     * @return функция для отмены подписки
     */
    instrumentInfo({ figi }: {
        figi: string;
    }, cb?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): () => void;
    /**
     * Метод для получения брокерских счетов клиента
     */
    accounts(): Promise<Response<UserAccounts>>;
}
