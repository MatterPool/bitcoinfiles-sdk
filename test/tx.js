'use strict';

const expect = require('chai').expect;
const index = require('../dist/index.js');
const axios = require('axios');

const options = {
	//bitcoinfiles_api_base: 'http://localhost:8080',
	api_key: '',
};

const txid = '4314f04b3f6ef8e3d148b6bfb4356e80497a03cbcab74fcd3cd6670ca1c4c5ee';

describe('transaction', () => {
	it('can query file', async () => {
		const bf = index.instance(options);
		const result = await bf.getFile(txid);
		expect(result).to.eql('/pay @1 @2 @3 @4 @5 @78 $0.10 just cuz.');
	});

	it('can query getTx', async () => {
		const bf = index.instance(options);
		const result = await bf.getTx(txid);
		expect(result).to.eql({
			hash: '4314f04b3f6ef8e3d148b6bfb4356e80497a03cbcab74fcd3cd6670ca1c4c5ee',
			version: 1,
			inputs: [
				{
					prevTxId: 'bd21f82cb1bfd0116ea9ad6c15df29e6df6adb6e33e785c5cedeb08b244078b4',
					outputIndex: 0,
					sequenceNumber: 4294967295,
					script:
						'47304402204e4ed918642d085978a5882be8a93b41b9da5f0880e9e7585dfbaabcabc3077a022035c4b6c74faf7870dd723373e6c19c43e87e8fdc9f927e0950ca5879f86e81994121029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50',
					scriptString:
						'71 0x304402204e4ed918642d085978a5882be8a93b41b9da5f0880e9e7585dfbaabcabc3077a022035c4b6c74faf7870dd723373e6c19c43e87e8fdc9f927e0950ca5879f86e819941 33 0x029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50',
				},
				{
					prevTxId: '37612ce8c40f09c7a4c809b12d149649b61dbd160a056ddded3d150df17f8f40',
					outputIndex: 5,
					sequenceNumber: 4294967295,
					script:
						'483045022100dcaa9d8ba174107aad8b2f8bf901de04a468472bd72dcfd7a48e30bd24ca30f60220785b28503c61a1faecfe71002ef6686f109baacd73978f1d805e1920c13677ba4121029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50',
					scriptString:
						'72 0x3045022100dcaa9d8ba174107aad8b2f8bf901de04a468472bd72dcfd7a48e30bd24ca30f60220785b28503c61a1faecfe71002ef6686f109baacd73978f1d805e1920c13677ba41 33 0x029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50',
				},
			],
			outputs: [
				{
					satoshis: 0,
					script:
						'006a2231394878696756345179427633744870515663554551797131707a5a56646f417574272f706179204031204032204033204034204035204037382024302e3130206a7573742063757a2e0a746578742f706c61696e04746578740a7477657463682e747874017c223150755161374b36324d694b43747373534c4b79316b683536575755374d74555235035345540b7477646174615f6a736f6e046e756c6c0375726c046e756c6c07636f6d6d656e74046e756c6c076d625f75736572046e756c6c057265706c79046e756c6c047479706504706f73740974696d657374616d70046e756c6c036170700674776574636807696e766f6963652466356166346332302d613064642d346465392d613662322d653561303362326364663765017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f454344534122313550436d747a524b344a567147354a485748326f4b596a524e3171756e596767504c58494831566d6273554330516a2f6675384a6656524d48527955477462536b796b466e4167716d326a6839466f485a51456b637579676735643652426f667a694e555a796f39343442353975357a7862334749646d37336f3d',
				},
				{
					satoshis: 9529,
					script: '76a91405186ff0710ed004229e644c0653b2985c648a2388ac',
				},
				{
					satoshis: 12529,
					script: '76a9147626cebf5037f1d8bb2db88a7d5ac6567e9ccdab88ac',
				},
				{
					satoshis: 11470,
					script: '76a9144995962a5d993fb685a5730d032fe64c5ca22c2888ac',
				},
				{
					satoshis: 11470,
					script: '76a914f59a941e458897d20bec63a819d1b33022221b3a88ac',
				},
				{
					satoshis: 11470,
					script: '76a91488ca138edefd83da91bc31b6956f87217813573588ac',
				},
				{
					satoshis: 11470,
					script: '76a914ca92ca2ff1733f04edf1510695b93bb98892379488ac',
				},
				{
					satoshis: 11470,
					script: '76a914e209971fdb58c56815011626802df52d9a702b5a88ac',
				},
				{
					satoshis: 239553,
					script: '76a91430137b98a2039539bcf969abb158dec4b3b8c64588ac',
				},
			],
			nLockTime: 0,
		});
	});

	it('can query getTxRaw', async () => {
		const bf = index.instance(options);
		const result = await bf.getTxRaw(txid);
		expect(result).to.eql(
			'0100000002b47840248bb0decec585e7336edb6adfe629df156cada96e11d0bfb12cf821bd000000006a47304402204e4ed918642d085978a5882be8a93b41b9da5f0880e9e7585dfbaabcabc3077a022035c4b6c74faf7870dd723373e6c19c43e87e8fdc9f927e0950ca5879f86e81994121029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50ffffffff408f7ff10d153deddd6d050a16bd1db64996142db109c8a4c7090fc4e82c6137050000006b483045022100dcaa9d8ba174107aad8b2f8bf901de04a468472bd72dcfd7a48e30bd24ca30f60220785b28503c61a1faecfe71002ef6686f109baacd73978f1d805e1920c13677ba4121029e603fca037cc685ccfa0f88f808aa610062561bbbdb561294b6c89bde7dfe50ffffffff090000000000000000fdd101006a2231394878696756345179427633744870515663554551797131707a5a56646f417574272f706179204031204032204033204034204035204037382024302e3130206a7573742063757a2e0a746578742f706c61696e04746578740a7477657463682e747874017c223150755161374b36324d694b43747373534c4b79316b683536575755374d74555235035345540b7477646174615f6a736f6e046e756c6c0375726c046e756c6c07636f6d6d656e74046e756c6c076d625f75736572046e756c6c057265706c79046e756c6c047479706504706f73740974696d657374616d70046e756c6c036170700674776574636807696e766f6963652466356166346332302d613064642d346465392d613662322d653561303362326364663765017c22313550636948473232534e4c514a584d6f53556157566937575371633768436676610d424954434f494e5f454344534122313550436d747a524b344a567147354a485748326f4b596a524e3171756e596767504c58494831566d6273554330516a2f6675384a6656524d48527955477462536b796b466e4167716d326a6839466f485a51456b637579676735643652426f667a694e555a796f39343442353975357a7862334749646d37336f3d39250000000000001976a91405186ff0710ed004229e644c0653b2985c648a2388acf1300000000000001976a9147626cebf5037f1d8bb2db88a7d5ac6567e9ccdab88acce2c0000000000001976a9144995962a5d993fb685a5730d032fe64c5ca22c2888acce2c0000000000001976a914f59a941e458897d20bec63a819d1b33022221b3a88acce2c0000000000001976a91488ca138edefd83da91bc31b6956f87217813573588acce2c0000000000001976a914ca92ca2ff1733f04edf1510695b93bb98892379488acce2c0000000000001976a914e209971fdb58c56815011626802df52d9a702b5a88acc1a70300000000001976a91430137b98a2039539bcf969abb158dec4b3b8c64588ac00000000'
		);
	});
});