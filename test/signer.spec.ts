import { KMSSigner } from '../src/signer/KMSSigner';

describe('Signer', function () {
    describe('construct', function () {
        it('should pass', () => {
            new KMSSigner();
        });
    });

    describe('sign', function () {
        it('should fail with the hash param not 32 bytes', async () => {
            const signer = new KMSSigner();
            try {
                const message = Buffer.from('12345678');
                expect(message.length).toBeLessThan(32);
                await signer.sign(message);
                throw 'It should throw';
            } catch (e) {}

            try {
                const message = Buffer.from(
                    '123456781234567812345678123456781234567812345678'
                );
                expect(message.length).toBeGreaterThan(32);
                await signer.sign(message);
                throw 'It should throw';
            } catch (e) {}
        });

        it('should work with the message is 32 bytes', async () => {
            const signer = new KMSSigner();
            const message = Buffer.from('12345678123456781234567812345678');
            expect(message.length).toBe(32);
            const sig = await signer.sign(message);
            expect(sig.signature.length).toBeGreaterThan(0);
        });
    });
});
