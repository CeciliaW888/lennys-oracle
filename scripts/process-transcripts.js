#!/usr/bin/env node
/**
 * Process Lenny's Podcast transcripts into card deck data for Lenny's Oracle
 * Extracts PM frameworks, key quotes, and guest info from 303 episodes
 */

import fs from 'fs';
import path from 'path';

const EPISODES_DIR = path.join(process.env.HOME, 'Repos/lennys-podcast-transcripts/episodes');
const OUTPUT_DIR = path.join(process.env.HOME, 'Repos/lennys-oracle/src/data');

// PM Frameworks to extract - curated list of frameworks mentioned across episodes
const PM_FRAMEWORKS = [
  { id: "rice-prioritization", framework: "RICE Prioritization", description: "Reach × Impact × Confidence ÷ Effort", category: "Strategy", keywords: ["RICE", "prioritization", "reach", "impact", "confidence", "effort"] },
  { id: "jobs-to-be-done", framework: "Jobs to Be Done", description: "Customers hire products to make progress in their lives", category: "Strategy", keywords: ["jobs to be done", "JTBD", "hire", "progress", "struggling moment"] },
  { id: "product-market-fit", framework: "Product-Market Fit", description: "The degree to which a product satisfies strong market demand", category: "Growth", keywords: ["product-market fit", "PMF", "retention", "pull", "word of mouth"] },
  { id: "north-star-metric", framework: "North Star Metric", description: "The single metric that best captures the core value your product delivers", category: "Data", keywords: ["north star", "metric", "single metric", "core value", "leading indicator"] },
  { id: "growth-loops", framework: "Growth Loops", description: "Self-reinforcing systems where output becomes input for new growth", category: "Growth", keywords: ["growth loop", "flywheel", "viral loop", "self-reinforcing", "compounding"] },
  { id: "working-backwards", framework: "Working Backwards", description: "Start from the customer experience and work backwards to the technology", category: "Strategy", keywords: ["working backwards", "PR/FAQ", "press release", "Amazon", "customer obsession"] },
  { id: "opportunity-solution-tree", framework: "Opportunity Solution Tree", description: "Visual tool connecting outcomes to opportunities to solutions to experiments", category: "Design", keywords: ["opportunity solution tree", "OST", "Teresa Torres", "continuous discovery", "opportunity"] },
  { id: "ice-scoring", framework: "ICE Scoring", description: "Impact × Confidence × Ease for quick prioritization", category: "Strategy", keywords: ["ICE", "scoring", "impact", "confidence", "ease"] },
  { id: "okrs", framework: "OKRs", description: "Objectives and Key Results — ambitious goals with measurable outcomes", category: "Leadership", keywords: ["OKR", "objective", "key result", "goal setting", "ambitious"] },
  { id: "design-thinking", framework: "Design Thinking", description: "Empathize → Define → Ideate → Prototype → Test", category: "Design", keywords: ["design thinking", "empathize", "prototype", "ideate", "human-centered"] },
  { id: "lean-startup", framework: "Lean Startup", description: "Build → Measure → Learn cycle to validate assumptions quickly", category: "Growth", keywords: ["lean startup", "MVP", "build measure learn", "validated learning", "pivot"] },
  { id: "pirate-metrics", framework: "Pirate Metrics (AARRR)", description: "Acquisition → Activation → Retention → Revenue → Referral", category: "Growth", keywords: ["AARRR", "pirate metrics", "acquisition", "activation", "retention", "revenue", "referral"] },
  { id: "kano-model", framework: "Kano Model", description: "Classify features as Must-be, Performance, or Delight", category: "Design", keywords: ["Kano", "delight", "must-have", "performance", "excitement"] },
  { id: "user-story-mapping", framework: "User Story Mapping", description: "Arrange user stories into a useful model for understanding system functionality", category: "Design", keywords: ["user story", "story mapping", "backbone", "walking skeleton"] },
  { id: "cohort-analysis", framework: "Cohort Analysis", description: "Group users by shared characteristics to track behavior over time", category: "Data", keywords: ["cohort", "retention curve", "user behavior", "time-based", "segmentation"] },
  { id: "network-effects", framework: "Network Effects", description: "Product becomes more valuable as more people use it", category: "Growth", keywords: ["network effect", "marketplace", "platform", "two-sided", "liquidity"] },
  { id: "strategic-narrative", framework: "Strategic Narrative", description: "Frame your company's story as a movement from old game to new game", category: "Leadership", keywords: ["strategic narrative", "storytelling", "movement", "old game", "new game", "Andy Raskin"] },
  { id: "disagree-and-commit", framework: "Disagree and Commit", description: "Voice disagreement, then fully commit to the decision once made", category: "Leadership", keywords: ["disagree and commit", "decision", "alignment", "commitment", "Amazon"] },
  { id: "pre-mortem", framework: "Pre-Mortem", description: "Imagine the project has failed — what went wrong?", category: "Strategy", keywords: ["pre-mortem", "risk", "failure", "kill criteria", "Annie Duke"] },
  { id: "activation-metric", framework: "Activation Metric", description: "The moment a user first experiences your product's core value", category: "Growth", keywords: ["activation", "aha moment", "magic moment", "onboarding", "time to value"] },
  { id: "viral-coefficient", framework: "Viral Coefficient", description: "Average number of new users each existing user generates", category: "Growth", keywords: ["viral", "K-factor", "referral", "invitation", "word of mouth"] },
  { id: "explore-exploit", framework: "Explore vs Exploit", description: "Balance trying new things with optimizing what works", category: "Strategy", keywords: ["explore", "exploit", "balance", "experimentation", "optimization"] },
  { id: "founder-mode", framework: "Founder Mode", description: "Stay deeply involved in product details rather than purely delegating", category: "Leadership", keywords: ["founder mode", "detail-oriented", "micromanagement", "deep involvement"] },
  { id: "category-creation", framework: "Category Creation", description: "Don't compete in existing categories — create and own a new one", category: "Strategy", keywords: ["category creation", "category design", "blue ocean", "positioning"] },
  { id: "continuous-discovery", framework: "Continuous Discovery", description: "Weekly touchpoints with customers to inform product decisions", category: "Design", keywords: ["continuous discovery", "weekly habits", "customer interview", "Teresa Torres"] },
  { id: "input-output-metrics", framework: "Input vs Output Metrics", description: "Focus on controllable inputs that drive desired outputs", category: "Data", keywords: ["input metric", "output metric", "leading indicator", "lagging indicator", "Amazon"] },
  { id: "product-led-growth", framework: "Product-Led Growth", description: "The product itself drives acquisition, conversion, and expansion", category: "Growth", keywords: ["product-led growth", "PLG", "self-serve", "freemium", "bottom-up"] },
  { id: "psychological-safety", framework: "Psychological Safety", description: "Team members feel safe to take risks and be vulnerable", category: "Culture", keywords: ["psychological safety", "trust", "vulnerability", "team", "Google"] },
  { id: "stakeholder-mapping", framework: "Stakeholder Mapping", description: "Identify and prioritize key stakeholders by influence and interest", category: "Leadership", keywords: ["stakeholder", "mapping", "influence", "alignment", "buy-in"] },
  { id: "minimum-lovable-product", framework: "Minimum Lovable Product", description: "Ship something small but delightful, not just viable", category: "Design", keywords: ["minimum lovable", "MLP", "delight", "lovable", "emotional"] },
  { id: "positioning", framework: "Positioning", description: "How your product is perceived relative to alternatives in the customer's mind", category: "Strategy", keywords: ["positioning", "April Dunford", "differentiated value", "competitive alternative", "category"] },
  { id: "curiosity-loops", framework: "Curiosity Loops", description: "Systematically gather diverse perspectives before making decisions", category: "Leadership", keywords: ["curiosity loop", "diverse perspective", "Ada Chen", "feedback gathering"] },
  { id: "single-threaded-leadership", framework: "Single-Threaded Leadership", description: "One leader, one mission — full ownership without divided attention", category: "Leadership", keywords: ["single-threaded", "ownership", "focus", "Amazon", "dedicated leader"] },
  { id: "understand-work", framework: "Understand Work", description: "Dedicate time to research and comprehension before execution", category: "Strategy", keywords: ["understand work", "research", "comprehension", "Bangaly Kaba"] },
  { id: "growth-competency-model", framework: "Growth Competency Model", description: "Evaluate growth talent across execution, customer knowledge, strategy, and communication", category: "Growth", keywords: ["growth competency", "hiring", "growth talent", "evaluation"] },
  { id: "product-as-organism", framework: "Product as Organism", description: "AI products continuously learn and improve through user interactions", category: "Strategy", keywords: ["product as organism", "AI product", "continuous learning", "Asha Sharma"] },
  { id: "speed-as-strategy", framework: "Speed as Strategy", description: "Move fast, ship quickly, iterate — speed is a competitive advantage", category: "Culture", keywords: ["speed", "velocity", "ship fast", "iteration", "bias for action"] },
  { id: "managed-marketplace", framework: "Managed Marketplace", description: "Platform that actively manages quality and experience, not just connects", category: "Growth", keywords: ["managed marketplace", "quality", "curation", "platform management"] },
  { id: "writing-culture", framework: "Writing Culture", description: "Use written documents over presentations for clearer thinking and better decisions", category: "Culture", keywords: ["writing", "memo", "document", "six-pager", "narrative"] },
  { id: "onboarding-optimization", framework: "Onboarding Optimization", description: "Optimize the first-time user experience to drive long-term retention", category: "Growth", keywords: ["onboarding", "first-time experience", "activation", "setup", "welcome"] },
  { id: "bar-raiser", framework: "Bar Raiser", description: "Every hire must raise the average quality of the team", category: "Culture", keywords: ["bar raiser", "hiring", "quality", "talent bar", "Amazon"] },
  { id: "running-toward-fear", framework: "Running Toward Fear", description: "The best leaders run toward the things they're afraid of, not away", category: "Leadership", keywords: ["fear", "courage", "difficult decisions", "Ben Horowitz"] },
  { id: "freemium-sampling", framework: "Freemium Sampling", description: "Let users experience premium value for free, then convert to paid", category: "Growth", keywords: ["freemium", "sampling", "free trial", "conversion", "paywall"] },
  { id: "difficult-conversations", framework: "Difficult Conversations", description: "Use scripts and frameworks to have necessary hard talks effectively", category: "Leadership", keywords: ["difficult conversation", "feedback", "performance", "script", "Alisa Cohn"] },
  { id: "gardener-mindset", framework: "Gardener vs Builder", description: "Cultivate conditions for emergence rather than engineering specific outcomes", category: "Culture", keywords: ["gardener", "builder", "emergence", "cultivation", "organic growth"] },
  { id: "channel-dna", framework: "Channel DNA", description: "Each acquisition channel has inherent characteristics that determine fit", category: "Growth", keywords: ["channel DNA", "acquisition channel", "channel fit", "marketing channel"] },
  { id: "demand-side-sales", framework: "Demand-Side Sales", description: "Understand why customers switch, not just why they should buy", category: "Strategy", keywords: ["demand-side", "switching", "push pull", "forces of progress", "Bob Moesta"] },
  { id: "functional-org", framework: "Functional Organization", description: "Organize by function (design, engineering, marketing) not by product division", category: "Culture", keywords: ["functional", "organization", "structure", "Brian Chesky", "divisional"] },
  { id: "self-compassion", framework: "Self-Compassion", description: "Treat yourself with the same kindness you'd show a friend in difficulty", category: "Culture", keywords: ["self-compassion", "burnout", "mental health", "kindness", "Andy Johns"] },
  { id: "agentic-products", framework: "Agentic Products", description: "Products that act autonomously on behalf of users, not just respond", category: "Strategy", keywords: ["agent", "agentic", "autonomous", "AI agent", "outcomes"] },
];

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};
  yaml.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      let value = line.substring(colonIdx + 1).trim();
      // Remove quotes
      if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  });
  return result;
}

function extractQuote(content, keywords) {
  const lines = content.split('\n');
  let bestQuote = '';
  let bestScore = 0;
  
  for (const line of lines) {
    // Skip non-speech lines
    if (line.startsWith('#') || line.startsWith('---') || line.trim() === '') continue;
    // Skip Lenny's ad reads and non-content lines
    if (line.includes('brought to you by') || line.includes('sponsor') || 
        line.includes('15% off') || line.includes('discount') ||
        line.includes('promo code') || line.includes('check it out at') ||
        line.includes('.com/') || line.includes('sign up') ||
        line.includes('Maven course') || line.includes('free trial') ||
        line.includes('Get 15%') || line.includes('coupon') ||
        line.includes('\\n') || line.includes('use code')) continue;
    // Skip Lenny's intros
    if (line.startsWith('Lenny (00:00') || line.startsWith('Lenny (00:01') || line.startsWith('Lenny (00:02') || line.startsWith('Lenny (00:03')) continue;
    
    // Remove speaker prefix
    const cleanLine = line.replace(/^[^:]+\(\d{2}:\d{2}:\d{2}\):\s*/, '').trim();
    if (cleanLine.length < 50 || cleanLine.length > 250) continue;
    // Skip lines that look like ads
    if (cleanLine.includes('Get ') && cleanLine.includes('off')) continue;
    if (cleanLine.includes('course') && cleanLine.includes('Maven')) continue;
    
    let score = 0;
    const lower = cleanLine.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 2;
    }
    // Prefer lines that feel like wisdom (contain "should", "important", "key", "best", "think about", etc.)
    if (lower.includes('important')) score += 1;
    if (lower.includes('key ')) score += 1;
    if (lower.includes('think about')) score += 1;
    if (lower.includes('framework')) score += 1;
    if (lower.includes('the way i')) score += 1;
    if (lower.includes('i think the')) score += 1;
    if (lower.includes('the most')) score += 1;
    if (lower.includes('really ')) score += 1;
    
    if (score > bestScore) {
      bestScore = score;
      bestQuote = cleanLine;
    }
  }
  
  // Truncate if too long
  if (bestQuote.length > 250) {
    bestQuote = bestQuote.substring(0, 247) + '...';
  }
  
  return bestQuote || '';
}

function findGuestForFramework(episodes, framework) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const ep of episodes) {
    let score = 0;
    const contentLower = ep.content.toLowerCase();
    
    for (const kw of framework.keywords) {
      const regex = new RegExp(kw.toLowerCase(), 'gi');
      const matches = contentLower.match(regex);
      if (matches) score += matches.length;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ep;
    }
  }
  
  return bestMatch;
}

async function main() {
  console.log('Processing 303 Lenny\'s Podcast transcripts...\n');
  
  // Read all episodes
  const episodeDirs = fs.readdirSync(EPISODES_DIR);
  const episodes = [];
  
  for (const dir of episodeDirs) {
    const transcriptPath = path.join(EPISODES_DIR, dir, 'transcript.md');
    if (!fs.existsSync(transcriptPath)) continue;
    
    const content = fs.readFileSync(transcriptPath, 'utf-8');
    const frontmatter = parseYamlFrontmatter(content);
    
    episodes.push({
      slug: dir,
      guest: frontmatter.guest || dir.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      title: frontmatter.title || '',
      youtubeUrl: frontmatter.youtube_url || '',
      videoId: frontmatter.video_id || '',
      publishDate: frontmatter.publish_date || '',
      content: content,
    });
  }
  
  console.log(`Loaded ${episodes.length} episodes\n`);
  
  // Build card deck
  const cards = [];
  
  for (const fw of PM_FRAMEWORKS) {
    const bestEp = findGuestForFramework(episodes, fw);
    if (!bestEp) continue;
    
    const quote = extractQuote(bestEp.content, fw.keywords);
    
    cards.push({
      id: fw.id,
      framework: fw.framework,
      description: fw.description,
      quote: quote || `Explore this framework through the lens of ${bestEp.guest}'s experience`,
      guest: bestEp.guest,
      episodeSlug: bestEp.slug,
      youtubeUrl: bestEp.youtubeUrl,
      category: fw.category,
    });
    
    console.log(`✅ ${fw.framework} → ${bestEp.guest}`);
  }
  
  // Also build a lightweight transcript index for RAG
  const transcriptChunks = [];
  let chunkId = 0;
  
  for (const ep of episodes) {
    // Remove frontmatter
    const textContent = ep.content.replace(/^---[\s\S]*?---\n/, '').trim();
    
    // Split into ~800 word chunks with overlap
    const words = textContent.split(/\s+/);
    const chunkSize = 800;
    const overlap = 100;
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.length < 200) continue;
      
      transcriptChunks.push({
        id: chunkId++,
        guest: ep.guest,
        slug: ep.slug,
        youtubeUrl: ep.youtubeUrl,
        text: chunk,
      });
    }
  }
  
  console.log(`\nBuilt ${cards.length} framework cards`);
  console.log(`Built ${transcriptChunks.length} transcript chunks for RAG`);
  
  // Write output
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'cards.json'),
    JSON.stringify(cards, null, 2)
  );
  
  // For RAG, we'll use a simpler approach - store episode summaries
  // Full chunks are too large for client-side, so we'll use Gemini's context window
  const episodeIndex = episodes.map(ep => ({
    slug: ep.slug,
    guest: ep.guest,
    title: ep.title,
    youtubeUrl: ep.youtubeUrl,
    publishDate: ep.publishDate,
  }));
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'episodes.json'),
    JSON.stringify(episodeIndex, null, 2)
  );
  
  // Save chunk count info
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'stats.json'),
    JSON.stringify({
      totalEpisodes: episodes.length,
      totalCards: cards.length,
      totalChunks: transcriptChunks.length,
      categories: {
        Growth: cards.filter(c => c.category === 'Growth').length,
        Strategy: cards.filter(c => c.category === 'Strategy').length,
        Design: cards.filter(c => c.category === 'Design').length,
        Leadership: cards.filter(c => c.category === 'Leadership').length,
        Data: cards.filter(c => c.category === 'Data').length,
        Culture: cards.filter(c => c.category === 'Culture').length,
      },
      processedAt: new Date().toISOString(),
    }, null, 2)
  );
  
  console.log('\n✨ Done! Output written to src/data/');
}

main().catch(console.error);
