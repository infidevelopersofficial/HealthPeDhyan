import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookmarkId = params.id;

    // Check if bookmark exists and belongs to user
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    if (bookmark.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json(
      { message: 'Bookmark deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Bookmark deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}

// Also support checking if an item is bookmarked (by product or article ID)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'product' or 'article'
    const itemId = params.id;

    if (!type || !['product', 'article'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "product" or "article"' },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        ...(type === 'product' ? { productId: itemId } : { articleId: itemId }),
      },
    });

    return NextResponse.json({
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?.id || null,
    });

  } catch (error) {
    console.error('Bookmark check error:', error);
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    );
  }
}
