const fs=require('fs'),path=require('path');
const out={en:{root:[],posts:[]},ja:{root:[],posts:[]},zh:{root:[],posts:[]}};
for(const lang of ['en','ja','zh']){
  const walk=(d)=>{
    for(const e of fs.readdirSync(d,{withFileTypes:true})){
      const p=path.join(d,e.name);
      if(e.isDirectory()) walk(p);
      else if(e.name.endsWith('.html')){
        let h=fs.readFileSync(p,'utf8').replace(/<!--[\s\S]*?-->/g,'');
        const t=(h.match(/<title>([^<]+)<\/title>/)||[])[1]||'';
        const d2=(h.match(/name="description" content="([^"]+)"/)||[])[1]||'';
        for(const s of [t,d2]){
          if(/[가-힣]+[A-Za-z]|[A-Za-z][가-힣]+|[가-힣]+[一-鿿]|[一-鿿][가-힣]+/.test(s)){
            const base=path.basename(p);
            if(p.includes('posts'+path.sep)) out[lang].posts.push(base);
            else if(!p.includes('static'+path.sep)) out[lang].root.push(base);
            break;
          }
        }
      }
    }
  };
  walk(lang);
}
for(const l of ['en','ja','zh']){
  console.log('=== '+l+' root ('+out[l].root.length+') ===');
  console.log(out[l].root.join('\n'));
}
console.log('\n=== Posts per lang ===');
for(const l of ['en','ja','zh']) console.log(l+': '+out[l].posts.length+' files');
// Save JSON for plan reuse
fs.writeFileSync('REMAINING_RETRANSLATION.json', JSON.stringify(out, null, 2));
console.log('\nSaved to REMAINING_RETRANSLATION.json');
