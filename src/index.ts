import { AASignerMain } from './AASignerMain';

async function main() {
    const aaSigner = new AASignerMain();
    aaSigner.init();
    await aaSigner.run();
}

main();
