const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const REWRITES = [
  ['en/compatibility_test.html', 'Free Compatibility Test - Name, MBTI, Zodiac 4-Way Match'],
  ['en/posts/ai_agent_what_is_2026_complete_guide.html', 'What Are AI Agents? Core Technology Transforming 2026'],
  ['en/posts/ai_emotion_facetech_future_lifestyle_2025.html', 'AI Reads Emotions: FaceTech Reshaping Lifestyle 2025'],
  ['en/posts/ai_hyper_personalized_marketing_strategies.html', '3 Hyper-Personalized Marketing Strategies for AI Era'],
  ['en/posts/bellflower_root_tea_syrup.html', 'Bellflower Root Benefits, Doraji Tea & Syrup Recipe'],
  ['en/posts/cheonggukjang_benefits.html', '10 Health Benefits of Cheonggukjang (Korean Soybean Paste)'],
  ['en/posts/cinnamon_tea_benefits_recipe.html', 'Cinnamon Tea Benefits & Traditional Sujeonggwa Recipe'],
  ['en/posts/climate_sensitivity_eco_friendly_consumption_tips.html', 'Eco-Friendly Consumption Tips to Boost Climate Sensitivity'],
  ['en/posts/digital_detox_guide.html', 'Digital Detox: Complete Program for Smartphone Addiction'],
  ['en/posts/divorce_property_division_child_support_guide.html', 'Korean Divorce 2026: Property Division & Child Support Guide'],
  ['en/posts/dubai_chewy_cookie_marketing_issues.html', 'Dubai Chewy Cookie: Social Issues & Marketing Controversies'],
  ['en/posts/earned_income_tax_credit_calculator_2026.html', '2026 Korea EITC Calculator | Eligibility + Up to 3.3M KRW'],
  ['en/posts/four_day_workweek_implementation_guide.html', '4-Day Workweek Guide: What Companies Need to Prepare'],
  ['en/posts/ginger_tea_benefits_recipe.html', 'Ginger Tea Benefits & Homemade Honey Ginger Tea Recipe'],
  ['en/posts/git_github_guide_05_actions.html', 'GitHub Actions & CI/CD - Git & GitHub Master Part 5'],
  ['en/posts/git_github_guide_06_opensource.html', 'Contributing to Open Source - Git & GitHub Master Part 6'],
  ['en/posts/jeonse_fraud_comprehensive_report.html', "Jeonse Fraud: Korea's Rental Deposit Scam Crisis Report"],
  ['en/posts/knee_joint_health.html', 'Knee Joint Health: Post-Artificial Joint Surgery Rehab'],
  ['en/posts/korea_esg_corporate_trends.html', 'ESG Management Trends & Outlook of Major Korean Companies'],
  ['en/posts/kudzu_root_benefits_juice_liquor_guide.html', 'Kudzu Root Benefits: Juice & Liquor Recipe (Natural Detox)'],
  ['en/posts/meditation_benefits.html', "7 Health Benefits of Meditation: Beginner's Guide to Start"],
  ['en/posts/multimodal_ai_content_creation_future.html', 'Beyond Text: Multimodal AI Transforming Content Creation'],
  ['en/posts/nuts_health_benefits_guide.html', 'Nuts Guide: Health Benefits & How to Eat Them Right'],
  ['en/posts/office_worker_vitamin_solution.html', "3 Must-Have Vitamins for Overworked Office Workers' Desks"],
  ['en/posts/physical_ai_robot_2026.html', 'What is Physical AI? Robots Entering Daily Lives in 2026'],
  ['en/posts/prompt_engineering_guide_01_basics.html', 'Prompt Engineering Basics - Communicate Effectively with AI'],
  ['en/posts/prompt_engineering_guide_03_claude.html', 'Claude Guide - Anthropic AI Features | Prompt Engineering 3'],
  ['en/posts/quince_benefits_liquor_guide.html', 'Mogwa (Quince): Health Benefits & Quince Liquor Recipe'],
  ['en/posts/shortform_commerce_success_guide.html', '5-Second Purchase Decision: Short-Form Commerce Success Guide'],
  ['en/posts/slow_aging_complete_guide.html', 'Slow Aging Guide - Healthy Aging Management in Your 40s'],
  ['en/posts/unfair_dismissal_wage_claim_guide.html', 'Korea 2026 Guide: Unfair Dismissal, Severance & Wage Claims'],
  ['en/posts/vitamin_d_benefits.html', 'Vitamin D Benefits: Essential Nutrient Guide for Healthy Life'],
  ['en/random_picker.html', 'Random Picker - Free Number, Team Divider & Ladder Game Tool'],
  ['en/speed_test.html', 'Internet Speed Test 2026 - Download/Upload/Ping (5 Sec Free)'],
  ['en/static/fractal_explorer.html', 'Fractal Explorer - Mandelbrot Zoom & 6 Fractal Patterns'],
  ['en/static/max_chatbot.html', 'MAX - Contrarian AI Chatbot That Disagrees With Everything'],
  ['en/static/mind_refresh_studio.html', 'Mind Refresh Studio - Breathing, Aurora, Zen Garden, Mandala'],
  ['en/static/particle_system.html', 'Particle System - Fireworks, Galaxy & 6 Interactive Effects'],
  ['en/static/relaxing_day.html', 'Evening Healing - Gratitude, Breath Meditation & Letting Go'],
  ['ja/posts/topping_economy_personal_customizing_items.html', 'トッピングエコノミー完全ガイド：2025年消費トレンドとカスタマイズアイテム'],
];

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escapeReplacement(s) {
  return s.replace(/\$/g, '$$$$');
}

let applied = 0;
let skipped = [];
const log = [];

for (const [relFile, newTitle] of REWRITES) {
  const file = path.join(ROOT, relFile);
  if (!fs.existsSync(file)) {
    skipped.push({ file: relFile, reason: 'not found' });
    continue;
  }

  let html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) {
    skipped.push({ file: relFile, reason: 'no title tag' });
    continue;
  }

  const oldTitle = m[1].trim();

  if (newTitle.length > 65) {
    skipped.push({ file: relFile, reason: 'new title > 65 chars: ' + newTitle.length });
    continue;
  }

  const newTitleHtml = newTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const newTitleAttr = escapeAttr(newTitle);

  html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + escapeReplacement(newTitleHtml) + '</title>');

  html = html.replace(
    /(<meta\s+property=["']og:title["']\s+content=)["'][^"']*["']/i,
    '$1"' + escapeReplacement(newTitleAttr) + '"'
  );

  html = html.replace(
    /(<meta\s+name=["']twitter:title["']\s+content=)["'][^"']*["']/i,
    '$1"' + escapeReplacement(newTitleAttr) + '"'
  );

  fs.writeFileSync(file, html);
  applied++;
  log.push({ file: relFile, oldLen: oldTitle.length, newLen: newTitle.length, oldTitle, newTitle });
}

console.log('=== Awkward title rewrite ===');
console.log('Applied:', applied);
console.log('Skipped:', skipped.length);
if (skipped.length) console.log('Skipped details:', JSON.stringify(skipped, null, 2));

console.log('\n=== Sample (first 10) ===');
log.slice(0, 10).forEach(x => {
  console.log('  [' + x.oldLen + '→' + x.newLen + '] ' + x.file);
  console.log('    OLD: ' + x.oldTitle);
  console.log('    NEW: ' + x.newTitle);
});

fs.writeFileSync('_awkward_rewrite_log.json', JSON.stringify(log, null, 2));
console.log('\nLog saved to _awkward_rewrite_log.json');
