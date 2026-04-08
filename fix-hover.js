const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/brand-darkPink/g, 'brand-primary/90');
    // For primary buttons hover states requested: #d63b63
    content = content.replace(/hover:bg-brand-darkPink/g, 'hover:bg-[#d63b63]');
    content = content.replace(/hover:bg-brand-primary\/90/g, 'hover:bg-[#d63b63]');
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
    }
});

console.log(`Replaced hovers in ${replacedCount} files.`);
