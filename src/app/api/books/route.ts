import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBooks, addBook } from '../../../lib/db';

export async function GET() {
  try {
    const books = getBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to get books:', error);
    return NextResponse.json({ error: 'سەرکەوتوو نەبوو لە هێنانی زانیارییەکان' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'secret-auth-token-12345') {
      return NextResponse.json({ error: 'ڕێگەپێنەدراو' }, { status: 401 });
    }

    const body = await request.json();
    
    // Simple validation
    if (!body.title || !body.author || !body.category) {
      return NextResponse.json({ error: 'تکایە خانە زۆرەکان پڕبکەرەوە (ناونیشان، نووسەر، هاوپۆل)' }, { status: 400 });
    }

    const newBook = addBook(body);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Failed to add book:', error);
    return NextResponse.json({ error: 'سەرکەوتوو نەبوو لە زیادکردنی کتێب' }, { status: 500 });
  }
}
