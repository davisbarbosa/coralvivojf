const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

const sitemap = new SitemapStream({ hostname: 'https://www.coralvivojf.com.br/' });

// Lista de URLs
const links = [
    { url: '/', priority: 1 },
    { url: '/estoque', priority: 0.8 },
    { url: '/peixes', priority: 0.8 },
    { url: '/corais', priority: 0.8 },
    { url: '/portifolio', priority: 0.6 },
    { url: '/loja', priority: 0.4 },
    // Adicione outras URLs conforme necessário
];

// Adiciona as URLs ao sitemap
links.forEach(link => sitemap.write(link));
sitemap.end();

streamToPromise(sitemap).then(data => {
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), data.toString());
}).catch(err => {
    console.error('Erro ao gerar o sitemap:', err);
});
