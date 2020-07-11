/// <reference types="node" />
import { EventEmitter } from 'events';
import { CandleStreaming, Depth, Interval, OrderbookStreaming } from './types';
/**
 * @hidden
 */
export default class Streaming extends EventEmitter {
    private _ws;
    private _wsPingTimeout?;
    private _wsQueue;
    private _subscribeMessages;
    private readonly socketURL;
    private readonly secretToken;
    private readonly authHeaders;
    /**
     *
     * @param apiURL REST api url см [документацию](https://tinkoffcreditsystems.github.io/invest-openapi/env/)
     * @param socketURL Streaming api url см [документацию](https://tinkoffcreditsystems.github.io/invest-openapi/env/)
     * @param secretToken токен доступа см [получение токена доступа](https://tinkoffcreditsystems.github.io/invest-openapi/auth/)
     *
     */
    constructor({ url, secretToken }: {
        url: string;
        secretToken: string;
    });
    /**
     * Соединяемся с сокетом
     */
    private connect;
    /**
     * Обработчик открытия соединения
     */
    private handleSocketOpen;
    /**
     * Зацикленная отправка пингов на сервер
     */
    private socketPingLoop;
    /**
     * Обработчик закрытия соединения
     */
    private handleSocketClose;
    /**
     * Обработчик ошибок и переподключение при необходимости
     */
    private handleSocketError;
    /**
     * Обработчик входящих сообщений
     */
    private handleSocketMessage;
    /**
     * Получение имени ивента
     */
    private getEventName;
    /**
     * Поставить сообщение в очередь на отправку в сокет
     */
    private enqueue;
    /**
     * Разбор очереди сообщений на отправку в сокет
     */
    private dispatchWsQueue;
    /**
     * Подписка на различные каналы в сокете
     */
    private subscribeToSocket;
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
}
