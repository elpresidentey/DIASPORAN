import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const cuisine = searchParams.get('cuisine');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Build query
    let query = supabase
      .from('dining_venues')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);
    
    // Apply filters
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }
    
    if (country) {
      query = query.ilike('country', `%${country}%`);
    }
    
    if (cuisine) {
      query = query.contains('cuisine_type', [cuisine]);
    }
    
    if (minRating) {
      query = query.gte('average_rating', parseFloat(minRating));
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching dining venues:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: 'Failed to fetch dining venues',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

