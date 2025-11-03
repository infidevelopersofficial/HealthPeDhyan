import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookmarkSchema = z.object({
  productId: z.string().optional(),
  articleId: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => data.productId || data.articleId,
  { message: 'Either productId or articleId must be provided' }
);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'product' or 'article' or undefined (all)

    const where: any = { userId: session.user.id };

    if (type === 'product') {
      where.productId = { not: null };
    } else if (type === 'article') {
      where.articleId = { not: null };
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        product: true,
        article: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks });

  } catch (error) {
    console.error('Bookmarks fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = bookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { productId, articleId, notes } = validationResult.data;

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        ...(productId ? { productId } : { articleId }),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Bookmark already exists' },
        { status: 400 }
      );
    }

    // Verify that the product or article exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    if (articleId) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        productId: productId || null,
        articleId: articleId || null,
        notes: notes || null,
      },
      include: {
        product: true,
        article: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Bookmark created successfully',
        bookmark,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Bookmark creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}
