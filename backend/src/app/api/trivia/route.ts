import { NextRequest, NextResponse } from 'next/server';

/*
TRIVIA CATEGORIES FOR FRONTEND REFERENCE:
- 9: General Knowledge
- 10: Entertainment: Books
- 11: Entertainment: Film
- 12: Entertainment: Music
- 13: Entertainment: Musicals & Theatres
- 14: Entertainment: Television
- 15: Entertainment: Video Games
- 16: Entertainment: Board Games
- 17: Science & Nature
- 18: Science: Computers
- 19: Science: Mathematics
- 20: Mythology
- 21: Sports
- 22: Geography
- 23: History
- 24: Politics
- 25: Art
- 26: Celebrities
- 27: Animals
- 28: Vehicles
- 29: Entertainment: Comics
- 30: Science: Gadgets
- 31: Entertainment: Japanese Anime & Manga
- 32: Entertainment: Cartoon & Animations

USAGE EXAMPLES:
- All questions: /api/trivia?amount=10
- Easy questions: /api/trivia?amount=5&difficulty=easy
- Computer Science Hard: /api/trivia?amount=3&category=18&difficulty=hard
- Sports True/False: /api/trivia?amount=5&category=21&type=boolean
- Film Multiple Choice: /api/trivia?amount=5&category=11&type=multiple
*/

// HTML entity decoding function
function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&#039;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&#40;': '(',
    '&#41;': ')',
    '&#44;': ',',
    '&#58;': ':',
    '&#59;': ';'
  };

  return text.replace(/&#?\w+;/g, (match) => entities[match] || match);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') || '10';
    const difficulty = searchParams.get('difficulty'); // easy, medium, hard
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type'); // multiple, boolean
    
    // Build API URL
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
    
    if (difficulty && difficulty !== 'random') {
      apiUrl += `&difficulty=${difficulty}`;
    }
    
    if (category) {
      apiUrl += `&category=${category}`;
    }
    
    if (type) {
      apiUrl += `&type=${type}`;
    }

    console.log('Fetching:', apiUrl);

    // Get data from Open Trivia API
    const response = await fetch(apiUrl);
    const apiData = await response.json();

    // Check for errors
    if (apiData.response_code !== 0) {
      return NextResponse.json({ 
        error: 'Failed to get questions',
        code: apiData.response_code 
      }, { status: 400 });
    }

    // add ID and mixed answers to each question
    const questions = apiData.results.map((q: any, index: number) => ({
      ...q, 
      id: `q_${Date.now()}_${index}`,
      question: decodeHtmlEntities(q.question),
      correct_answer: decodeHtmlEntities(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
      all_answers: [
        decodeHtmlEntities(q.correct_answer),
        ...q.incorrect_answers.map(decodeHtmlEntities)
      ].sort(() => 0.5 - Math.random())
    }));

    return NextResponse.json({ questions });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}