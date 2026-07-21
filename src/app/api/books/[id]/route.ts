import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateBook, deleteBook } from '../../../../lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'secret-auth-token-12345') {
      return NextResponse.json({ error: 'ڕێگەپێنەدراو' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.title || !body.author || !body.category) {
      return NextResponse.json({ error: 'تکایە خانە زۆرەکان پڕبکەرەوە (ناونیشان، نووسەر، هاوپۆل)' }, { status: 400 });
    }

    const updated = updateBook(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update book:', error);
    return NextResponse.json({ error: 'سەرکەوتوو نەبوو لە نوێکردنەوەی کتێب' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token !== 'secret-auth-token-12345') {
      return NextResponse.json({ error: 'ڕێگەپێنەدراو' }, { status: 401 });
    }

    const { id } = await params;
    deleteBook(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete book:', error);
    return NextResponse.json({ error: 'سەرکەوتوو نەبوو لە سڕینەوەی کتێب' }, { status: 500 });
  }
}
