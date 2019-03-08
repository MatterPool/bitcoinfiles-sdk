import * as datapay from 'datapay';
import axios from 'axios';
import { FileData } from './models/file-data.interface';
declare var Buffer: any;
import * as textEncoder from 'text-encoder';

function buf2hex(buffer: any) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

const defaultOptions = {
    bitdb_api_base: 'https://babel.bitdb.network/q/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/',
    bitdb_api_key: '12cHytySdrQGRtuvvkVde2j3e74rmEn5TM',
    bitcoinfiles_api_base: 'https://media.bitcoinfiles.org',
}

/**
 * Client provides abilities to create and get bitcoinfiles
 */
export class Client {
    options = defaultOptions;
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
    }

    /**
     * Resolve a promise and/or invoke a callback
     * @param resolveOrReject Resolve or reject function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private callbackAndResolve(resolveOrReject: Function, data: any, callback?: Function) {
        if (callback) {
            callback(data);
        }
        if (resolveOrReject) {
            return resolveOrReject(data)
        }
    }
    private hexEncode(str: string): string {
        function buf2hex(buffer: any): any {
          return Array.prototype.map.call(new Uint8Array(buffer), (x: any) => ('00' + x.toString(16)).slice(-2)).join('');
        }
        let enc = new textEncoder.TextEncoder().encode(str);
        return '0x' + buf2hex(enc)
    }

    private isUtf8(encoding: string): boolean {
        if (!encoding || /\s*/i.test(encoding)) {
            return true;
        }
        return /utf\-?8$/i.test(encoding);
    }

    /**
     *
     * @param request create request
     * @param callback Optional callback to invoke after completed
     */
    create(request: { file: FileData, pay: { key: string } }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!request.pay || !request.pay.key || request.pay.key === '') {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'key required'
                }, callback);
            }

            if (!request.file) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'file required'
                }, callback);
            }

            if (!request.file.content) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'content required'
                }, callback);
            }

            if (!request.file.contentType) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'contentType required'
                }, callback);
            }

            try {
                let encoding = request.file.encoding ? request.file.encoding : 'utf-8';
                let content = '';
                if (this.isUtf8(encoding)) {
                    encoding = 'utf-8';
                    content = this.hexEncode(request.file.content)
                } else {
                    content = request.file.content
                }
                const args = [
                    "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
                    content,
                    this.hexEncode(request.file.contentType),
                    this.hexEncode(encoding)
                ];

                if (request.file && (request.file.name && request.file.name !== '' || (request.file.tags && request.file.tags.length))) {
                    let filename = request.file.name ? request.file.name : '';
                    args.push(this.hexEncode(filename));
                    if (request.file.tags) {
                        request.file.tags.map((tag) => args.push(this.hexEncode(tag)));
                    }
                }
                datapay.send({
                    data: args,
                    pay: {
                        key: request.pay.key,
                    }
                }, async (err: any, transaction: any) => {
                    if (err) {
                        console.log('err', err);
                        return this.callbackAndResolve(resolve, {
                            success: false,
                            message: err.message ? err.message : err.toString()
                        }, callback);
                    }
                    return this.callbackAndResolve(resolve, {
                        success: true,
                        txid: transaction
                    }, callback)
                })
            } catch (ex) {
                console.log('ex', ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }

    /**
     * Get a file by txid
     * @param txid txid of file
     * @param callback Optional callback to invoke after completed
     */
    get(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!txid) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'txid required'
                }, callback);
            }
            try {
                let query = this.baseQuery(-1, 0, 0);
                query = this.addFindClause(query, 'tx.h', txid);

                axios.get(
                    this.options.bitdb_api_base + Buffer.from(JSON.stringify(query)).toString('base64'),
                    {
                        headers: { key: this.options.bitdb_api_key }
                    }
                ).then((response) => {
                    let tx = response.data.u[0] ? response.data.u[0] : response.data.c[0] ? response.data.c[0] : undefined;

                    if (!tx) {
                        throw Error('not found');
                    }
                    const formattedResults: any[] = [];
                    formattedResults.push(
                        {
                            txid: tx.txid,
                            url: `${this.options.bitcoinfiles_api_base}/${tx.txid}`
                        }
                    );
                    this.callbackAndResolve(resolve, {
                        success: true,
                        data: formattedResults
                    }, callback);

                }).catch((ex) => {
                    console.log('ex', ex);
                    this.callbackAndResolve(resolve, {
                        success: false,
                        message: ex.message ? ex.message : ex.toString()
                    }, callback)
                })
            } catch (ex) {
                console.log('ex', ex.toString(), ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }
    /**
     * Find files matching certain criteria
     * @param request find request
     * @param callback Optional callback to invoke after completed
     */
    find(request: {
        address?: string,
        contentType?: string,
        name?: string,
        tags?: string[],
        skip?: number,
        limit?: number,
        sort?: -1 | 1,
        debug?: boolean
    }, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!request) {
                return this.callbackAndResolve(resolve, {
                    success: false,
                    message: 'field required'
                }, callback);
            }
            try {

                let sort = request.sort ? request.sort : -1;
                let limit = request.limit ? request.limit : 1;
                let skip = request.skip ? request.skip : 0;
                let query = this.baseQuery(sort, limit, skip);

                if (request.address) {
                    query = this.addFindClause(query, 'in.e.a', request.address);
                }
                if (request.contentType) {
                    query = this.addFindClause(query, 'out.s3', request.contentType);
                }
                if (request.name) {
                    query = this.addFindClause(query, 'out.s5', request.name);
                }
                if (request.tags && request.tags.length) {
                    let tagStartIndex = 6;
                    for (const tag of request.tags) {
                        tagStartIndex++;
                        // Do not search on null or undefined tag, skip it
                        if (tag === undefined || tag === null) {
                            continue;
                        }
                        let tagField = 'out.s' + tagStartIndex;
                        query = this.addFindClause(query, tagField, tag);
                    }
                }
                if (request.debug) {
                    console.log('find query', query);
                }
                axios.get(
                    this.options.bitdb_api_base + Buffer.from(JSON.stringify(query)).toString('base64'),
                    {
                        headers: { key: this.options.bitdb_api_key }
                    }
                ).then((response) => {
                    let unconfirmed = response.data.u;
                    let confirmed = response.data.c;
                    let txs = [];

                    if (unconfirmed.length) {
                        txs = unconfirmed;
                    }
                    if (confirmed.length) {
                        txs = txs.concat(confirmed);
                    }

                    const formattedResults: any[] = [];
                    txs.map((tx: any) => {
                        formattedResults.push(
                            {
                                txid: tx.txid,
                                url: `${this.options.bitcoinfiles_api_base}/${tx.txid}`
                            }
                        );
                    });
                    this.callbackAndResolve(resolve, {
                        success: true,
                        data: formattedResults
                    }, callback);

                }).catch((ex) => {
                    console.log('ex', ex);
                    this.callbackAndResolve(resolve, {
                        success: false,
                        message: ex.message ? ex.message : ex.toString()
                    }, callback)
                })
            } catch (ex) {
                console.log('ex', ex.toString(), ex);
                this.callbackAndResolve(resolve, {
                    success: false,
                    message: ex.message ? ex.message : ex.toString()
                }, callback)
            }
        });
    }

    private baseQuery(sort: number = -1, limit: number = 1, skip: number = 0): any {
        return {
            "v": 3,
            "q": {
                "find": {
                },
                "limit": limit,
                "skip": skip,
                "sort": { "blk.i": sort}
            },
            "r": {
                "f": "[.[] | { txid: .tx.h, inputInfo: . | { in: .in? }, blockInfo: . | { blockIndex: .blk.i?, blockTime: .blk.t?}, out: .out  } ]"
            }
        }
    }

    private addFindClause(query: any, field: string, value: string): any {
        const updatedQuery = query;
        updatedQuery.q.find = Object.assign({}, updatedQuery.q.find, {
            [field]: value
        });
        return updatedQuery;
    }
}