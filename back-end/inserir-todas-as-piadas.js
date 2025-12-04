import { openDb, setupDatabase } from './src/config/database.js';           // ajuste o caminho se necessário
import { createPiada } from './src/models/Piada.js'; // caminho para o arquivo que tem a função createPiada
import piadas from './piadas.json' with { type: 'json' }; // ES Modules + import JSON (Node ≥ 17.5)

const db = await openDb();

await db.run(
    'DROP TABLE IF EXISTS piadas'
);

await setupDatabase()

console.log(`Iniciando inserção de ${piadas.length} piadas...\n`);

for (const [index, piada] of piadas.entries()) {
    try {
        await createPiada(piada.pergunta, piada.resposta);
        process.stdout.write(`\rPiadas inseridas: ${(index + 1).toString().padStart(3)}/${piadas.length}`);
    } catch (erro) {
        console.error(`\nErro na piada ${index + 1}:`, erro.message);
    }
}

console.log('\n\nTodas as 95 piadas foram inseridas com sucesso!');
