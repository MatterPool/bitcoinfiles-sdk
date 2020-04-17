'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

const options = {
	// bitcoinfiles_api_base: 'http://localhost:8082',
};

describe('block', () => {
	it('Can query for blockchain info', async () => {
		//     {"chain":"main","blocks":630756,"bestblockhash":"0000000000000000038445394e87e5103343f34f91da9f4c9fd1a754e5e16b31","difficulty":197513539700.0701,"mediantime":1586980990,"verificationprogress":0.9999899941505928,"chainwork":"000000000000000000000000000000000000000001060b7473a70fece894e1fa"}

		var bf = index.instance(options);
		const result = await bf.getBlockchainInfo();

		expect(result.chain).to.eql('main');
		expect(!!result.bestblockhash).to.eql(true);
		expect(!!result.difficulty).to.eql(true);
		expect(!!result.blocks).to.eql(true);
		expect(!!result.verificationprogress).to.eql(true);
		expect(!!result.mediantime).to.eql(true);
	});

	it('Can query for raw header by blockhash', async () => {
		try {
			var bf = index.instance(options);
			await bf.getBlockHeaderRaw(1);
			expect(ex).to.eql({});
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		var bf = index.instance(options);
		const block = await bf.getBlockHeaderRaw(
			'0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449'
		);
		expect(block).to.eql(
			'01000000bddd99ccfda39da1b108ce1a5d70038d0a967bacb68b6b63065f626a0000000044f672226090d85db9a9f2fbfe5f0f9609b387af7be5b7fbb7a1767c831c9e995dbe6649ffff001d05e0ed6d'
		);
	});

	it('Can query for header by blockhash', async () => {
		try {
			var bf = index.instance(options);
			await bf.getBlockHeader(1);
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		var bf = index.instance(options);
		const block = await bf.getBlockHeader(
			'0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449'
		);
		expect(block).to.eql({
			hash: '0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449',
			height: 3,
			version: 1,
			versionHex: '00000001',
			merkleroot: '999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644',
			time: 1231470173,
			mediantime: 1231469744,
			nonce: 1844305925,
			bits: '1d00ffff',
			difficulty: 1,
			chainwork: '0000000000000000000000000000000000000000000000000000000400040004',
			previousblockhash: '000000006a625f06636b8bb6ac7b960a8d03705d1ace08b1a19da3fdcc99ddbd',
			nextblockhash: '000000004ebadb55ee9096c9a2f8880e09da59c0d68b1c228da88e48844a1485'
		});
	});

	it('Can query raw by blockhash', async () => {
		try {
			var bf = index.instance(options);
			await bf.getBlockRaw(1);
			expect(ex).to.eql({});
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		try {
			var bf = index.instance(options);
			await bf.getBlockRaw('1000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449');
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		var bf = index.instance(options);
		const block = await bf.getBlockRaw(
			'0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449'
		);
		expect(block).to.eql(
			'01000000bddd99ccfda39da1b108ce1a5d70038d0a967bacb68b6b63065f626a0000000044f672226090d85db9a9f2fbfe5f0f9609b387af7be5b7fbb7a1767c831c9e995dbe6649ffff001d05e0ed6d0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d010effffffff0100f2052a0100000043410494b9d3e76c5b1629ecf97fff95d7a4bbdac87cc26099ada28066c6ff1eb9191223cd897194a08d0c2726c5747f1db49e8cf90e75dc3e3550ae9b30086f3cd5aaac00000000'
		);
	});

	it('Can query by blockhash', async () => {
		try {
			var bf = index.instance(options);
			await bf.getBlock(1);
			expect(ex).to.eql({});
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		try {
			var bf = index.instance(options);
			await bf.getBlock('1000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449');
			expect(ex).to.eql({});
		} catch (ex) {
			expect(ex).to.eql({
				code: 404,
				error: 'Block not found',
				message: '',
				success: false
			});
		}

		var bf = index.instance(options);
		const block = await bf.getBlock(
			'0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449'
		);
		expect(block).to.eql({
			header: {
				hash: '0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449',
				version: 1,
				prevHash: '000000006a625f06636b8bb6ac7b960a8d03705d1ace08b1a19da3fdcc99ddbd',
				merkleRoot: '999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644',
				time: 1231470173,
				bits: 486604799,
				nonce: 1844305925,
				height: 3
			},
			tx: [
				{
					hash: '999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644',
					version: 1,
					inputs: [
						{
							prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
							outputIndex: 4294967295,
							sequenceNumber: 4294967295,
							script: '04ffff001d010e'
						}
					],
					outputs: [
						{
							satoshis: 5000000000,
							script:
								'410494b9d3e76c5b1629ecf97fff95d7a4bbdac87cc26099ada28066c6ff1eb9191223cd897194a08d0c2726c5747f1db49e8cf90e75dc3e3550ae9b30086f3cd5aaac'
						}
					],
					nLockTime: 0
				}
			],
			block: {
				header: {
					hash: '0000000082b5015589a3fdf2d4baff403e6f0be035a5d9742c1cae6295464449',
					version: 1,
					prevHash: '000000006a625f06636b8bb6ac7b960a8d03705d1ace08b1a19da3fdcc99ddbd',
					merkleRoot: '999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644',
					time: 1231470173,
					bits: 486604799,
					nonce: 1844305925
				},
				transactions: [
					{
						hash: '999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644',
						version: 1,
						inputs: [
							{
								prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
								outputIndex: 4294967295,
								sequenceNumber: 4294967295,
								script: '04ffff001d010e'
							}
						],
						outputs: [
							{
								satoshis: 5000000000,
								script:
									'410494b9d3e76c5b1629ecf97fff95d7a4bbdac87cc26099ada28066c6ff1eb9191223cd897194a08d0c2726c5747f1db49e8cf90e75dc3e3550ae9b30086f3cd5aaac'
							}
						],
						nLockTime: 0
					}
				]
			}
		});
	});

	it('Can query by block height', async () => {
		try {
			var bf = index.instance(options);
			await bf.getBlockHash('d');
		} catch (ex) {
			expect(ex).to.eql({
				code: 422,
				error: 'height must be number',
				message: '',
				success: false
			});
		}

		var bf = index.instance(options);
		const block = await bf.getBlockHash(1);
		expect(block).to.eql({
			blockhash: '00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048'
		});

		const block2 = await bf.getBlockHash(0);
		expect(block2).to.eql({
			blockhash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'
		});
	});

	it('Can query by one string match', async () => {
		var bf = index.instance(options);
		const application = Buffer.from('BitcoinFiles.org', 'utf8').toString('hex');
		const filtered = await bf.getBlockFiltered(
			'00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177',
			application
		);
		expect('426974636f696e46696c65732e6f7267').to.eql(application);
		expect(filtered.length).to.eql(1);
	});

	it('Can not find any results with no match', async () => {
		var bf = index.instance(options);
		const application = Buffer.from('BitcoinFiles.org', 'utf8').toString('hex');
		const filtered = await bf.getBlockFiltered(
			'00000000000000000013fd298b5567aa19f71de983f04f6d3eea1660c2d2b177',
			`54332545534|0123456789`
		);
		expect(filtered.length).to.eql(0);
	});
	it('Can query by boost match', async () => {
		// 630,527
	});
});
