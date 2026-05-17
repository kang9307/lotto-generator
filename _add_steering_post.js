const fs = require('fs');
const data = JSON.parse(fs.readFileSync('posts/index.json', 'utf8'));

const NEW = {
  id: 'llm_steering_vectors_deepseek_v4_2026',
  filename: 'llm_steering_vectors_deepseek_v4_2026.html',
  title: 'LLM Steering Vectors 2026 - DeepSeek-V4로 모델 제어 실험',
  date: '2026-05-17',
  category: 'IT/기술',
  keywords: 'LLM Steering, Steering Vectors, DeepSeek V4, DwarfStar 4, llama.cpp, 활성화 벡터, AI 모델 제어, LLM 해석성, 로컬 LLM, 프롬프트 엔지니어링',
  featured: true
};

data.files = [NEW.filename, ...data.files.filter(f => f !== NEW.filename)];
data.posts = [NEW, ...data.posts.filter(p => p.id !== NEW.id)];
data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
data.posts.forEach((p, i) => { p.featured = i < 5; });
data.totalFiles = data.files.length;
data.lastUpdated = '2026-05-17';

fs.writeFileSync('posts/index.json', JSON.stringify(data, null, 2));
console.log('Added:', NEW.title);
console.log('Total:', data.totalFiles);
console.log('Top 5 featured:');
data.posts.filter(p => p.featured).forEach(p => console.log('  ' + p.date + ' - ' + p.title.slice(0,60)));
