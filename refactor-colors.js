const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');
const sellerDir = path.join(__dirname, 'src', 'app', 'seller');
const componentsDir = path.join(__dirname, 'src', 'components', 'layout');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if(file.endsWith('.tsx')) {
         arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

// 1. Admin Replacements
const adminFiles = getAllFiles(adminDir);
adminFiles.push(path.join(componentsDir, 'AdminSidebar.tsx'));

const adminReplacements = [
   { from: /text-blue-600/g, to: 'text-brand-teal' },
   { from: /text-blue-700/g, to: 'text-brand-teal' },
   { from: /text-blue-500/g, to: 'text-brand-teal' },
   { from: /bg-blue-600/g, to: 'bg-brand-teal' },
   { from: /bg-blue-700/g, to: 'bg-teal-700' },
   { from: /bg-blue-500/g, to: 'bg-brand-teal' },
   { from: /bg-blue-50/g, to: 'bg-brand-teal/10' },
   { from: /bg-blue-100/g, to: 'bg-brand-teal/20' },
   { from: /border-blue-600/g, to: 'border-brand-teal' },
   { from: /border-blue-500/g, to: 'border-brand-teal' },
   { from: /border-blue-200/g, to: 'border-brand-teal/30' },
   { from: /border-blue-100/g, to: 'border-brand-teal/20' },
   { from: /ring-blue-500/g, to: 'ring-brand-teal' },
   { from: /ring-blue-600/g, to: 'ring-brand-teal' },
   { from: /text-indigo-600/g, to: 'text-brand-pink' },
   { from: /text-indigo-700/g, to: 'text-[#d6517a]' },
   { from: /text-indigo-500/g, to: 'text-brand-pink' },
   { from: /bg-indigo-600/g, to: 'bg-brand-pink' },
   { from: /bg-indigo-500/g, to: 'bg-brand-pink' },
   { from: /bg-indigo-50/g, to: 'bg-brand-pink/10' },
   { from: /bg-indigo-100/g, to: 'bg-brand-pink/20' },
   { from: /border-indigo-600/g, to: 'border-brand-pink' },
   { from: /border-indigo-500/g, to: 'border-brand-pink' },
   { from: /border-indigo-200/g, to: 'border-brand-pink/30' },
   { from: /ring-indigo-500/g, to: 'ring-brand-pink' },
   { from: /text-pink-600/g, to: 'text-brand-pink' },
   { from: /text-pink-500/g, to: 'text-brand-pink' },
   { from: /bg-pink-600/g, to: 'bg-brand-pink' },
   { from: /bg-pink-700/g, to: 'bg-[#d6517a]' },
   { from: /ring-pink-500/g, to: 'ring-brand-pink' },
   { from: /border-pink-500/g, to: 'border-brand-pink' },
];

adminFiles.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   adminReplacements.forEach(rep => {
      content = content.replace(rep.from, rep.to);
   });
   fs.writeFileSync(file, content, 'utf8');
});


// 2. Seller Replacements
const sellerFiles = getAllFiles(sellerDir);
sellerFiles.push(path.join(componentsDir, 'SellerSidebar.tsx'));

const sellerReplacements = [
   // Base Light Colors
   { from: /bg-slate-900\/50/g, to: 'bg-white/50' },
   { from: /bg-slate-900\/80/g, to: 'bg-white/80' },
   { from: /bg-slate-900\/30/g, to: 'bg-white/30' },
   { from: /bg-slate-900/g, to: 'bg-white' },
   { from: /bg-slate-800\/80/g, to: 'bg-gray-50/80' },
   { from: /bg-slate-800\/50/g, to: 'bg-gray-50/50' },
   { from: /bg-slate-800\/30/g, to: 'bg-gray-50/30' },
   { from: /bg-slate-800\/20/g, to: 'bg-gray-50/20' },
   { from: /bg-slate-800/g, to: 'bg-gray-50' },
   // Gradients
   { from: /from-slate-900 to-slate-800/g, to: 'from-white to-gray-50' },
   { from: /from-slate-900\/80/g, to: 'from-white/80' },
   { from: /from-slate-800/g, to: 'from-gray-50' },
   // Borders
   { from: /border-slate-800\/50/g, to: 'border-gray-100' },
   { from: /border-slate-700\/50/g, to: 'border-gray-200' },
   { from: /border-slate-800/g, to: 'border-gray-100' },
   { from: /border-slate-700/g, to: 'border-gray-200' },
   { from: /divide-slate-800\/50/g, to: 'divide-gray-100' },
   { from: /divide-slate-800/g, to: 'divide-gray-100' },
   { from: /divide-slate-700\/50/g, to: 'divide-gray-200' },
   { from: /divide-slate-700/g, to: 'divide-gray-200' },
   // Text
   { from: /text-slate-300/g, to: 'text-gray-700' },
   { from: /text-slate-400/g, to: 'text-gray-500' },
   { from: /text-slate-500/g, to: 'text-gray-400' },
   { from: /text-slate-600/g, to: 'text-gray-400' }, // For placeholders
   { from: /text-slate-200/g, to: 'text-gray-800' },
   { from: /text-white/g, to: 'text-gray-900' },
   { from: /placeholder:text-slate-500/g, to: 'placeholder:text-gray-400' },
   { from: /placeholder:text-slate-600/g, to: 'placeholder:text-gray-400' },
   
   // Accents -> Brand Colors
   // Fuchsia -> Brand Pink
   { from: /text-fuchsia-400/g, to: 'text-brand-pink' },
   { from: /text-fuchsia-500/g, to: 'text-brand-pink' },
   { from: /bg-fuchsia-600/g, to: 'bg-brand-pink' },
   { from: /bg-fuchsia-500\/10/g, to: 'bg-brand-pink/10' },
   { from: /bg-fuchsia-500/g, to: 'bg-brand-pink' },
   { from: /border-fuchsia-500\/20/g, to: 'border-brand-pink/20' },
   { from: /border-fuchsia-500/g, to: 'border-brand-pink' },
   { from: /ring-fuchsia-500/g, to: 'ring-brand-pink' },
   { from: /from-fuchsia-400/g, to: 'from-brand-pink' },
   
   // Violet -> Brand Teal
   { from: /text-violet-400/g, to: 'text-brand-teal' },
   { from: /text-violet-500/g, to: 'text-brand-teal' },
   { from: /text-violet-200/g, to: 'text-teal-700' },
   { from: /bg-violet-600/g, to: 'bg-brand-teal' },
   { from: /bg-violet-500\/10/g, to: 'bg-brand-teal/10' },
   { from: /bg-violet-500/g, to: 'bg-brand-teal' },
   { from: /border-violet-500\/20/g, to: 'border-brand-teal/20' },
   { from: /border-violet-500/g, to: 'border-brand-teal' },
   { from: /ring-violet-500/g, to: 'ring-brand-teal' },
   { from: /to-violet-400/g, to: 'to-brand-teal' },
   { from: /to-violet-500/g, to: 'to-brand-teal' },
   
   // Cyan/Indigo (misc secondary) -> Teal
   { from: /text-cyan-400/g, to: 'text-brand-teal' },
   { from: /bg-cyan-600/g, to: 'bg-brand-teal' },
   { from: /bg-cyan-500\/10/g, to: 'bg-brand-teal/10' },
   { from: /border-cyan-500\/20/g, to: 'border-brand-teal/20' },
   { from: /border-cyan-500/g, to: 'border-brand-teal' },
   { from: /ring-cyan-500/g, to: 'ring-brand-teal' },

   { from: /text-indigo-400/g, to: 'text-brand-teal' },
   { from: /text-indigo-500/g, to: 'text-brand-teal' },
   { from: /bg-indigo-600/g, to: 'bg-brand-teal' },
   { from: /bg-indigo-500\/10/g, to: 'bg-brand-teal/10' },
   { from: /border-indigo-500\/20/g, to: 'border-brand-teal/20' },
   { from: /border-indigo-500/g, to: 'border-brand-teal' },
   { from: /ring-indigo-500/g, to: 'ring-brand-teal' },

   // Specific dark mode components like chat bubbles or alerts
   { from: /shadow-\[0_4px_15px_rgba\(139,92,246,0\.15\)\]/g, to: 'shadow-glow' },
   { from: /shadow-\[0_0_15px_rgba\(79,70,229,0\.3\)\]/g, to: 'shadow-soft' },
   { from: /shadow-\[0_0_15px_rgba\(34,211,238,0\.3\)\]/g, to: 'shadow-soft' }
];

sellerFiles.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   sellerReplacements.forEach(rep => {
      content = content.replace(rep.from, rep.to);
   });
   fs.writeFileSync(file, content, 'utf8');
});

console.log("Refactoring complete");
