import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Sentiment from "sentiment"

const sentiment = new Sentiment()

// Helper function to analyze sentiment from text
function analyzeSentiment(text: string) {
  const analysis = sentiment.analyze(text)
  return {
    score: analysis.score,
    comparative: analysis.comparative  // normalized score between -1 and 1
  }
}

// Helper function to extract keywords with their sentiment context
function extractKeywords(reviews: any[]) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 
    'for', 'of', 'with', 'by', 'event', 'was', 'very', 'really', 
    'great', 'good', 'bad', 'nice', 'awesome', 'terrible'
  ])
  
  const keywords: {
    [key: string]: {
      count: number
      positiveCount: number
      negativeCount: number
      neutralCount: number
      averageSentiment: number
    }
  } = {}
  
  reviews.forEach(review => {
    if (!review.comment) return
    
    const words = review.comment
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))

    const sentimentScore = analyzeSentiment(review.comment).comparative
    const sentiment = sentimentScore > 0.2 ? 'positive' : 
                     sentimentScore < -0.2 ? 'negative' : 'neutral'

    words.forEach(word => {
      if (!keywords[word]) {
        keywords[word] = {
          count: 0,
          positiveCount: 0,
          negativeCount: 0,
          neutralCount: 0,
          averageSentiment: 0
        }
      }
      
      keywords[word].count++
      keywords[word][`${sentiment}Count`]++
      keywords[word].averageSentiment = 
        ((keywords[word].averageSentiment * (keywords[word].count - 1)) + sentimentScore) / 
        keywords[word].count
    })
  })

  return Object.entries(keywords)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([word, stats]) => ({
      word,
      count: stats.count,
      sentiment: {
        positive: stats.positiveCount,
        neutral: stats.neutralCount,
        negative: stats.negativeCount
      },
      averageSentiment: stats.averageSentiment
    }))
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ORGANIZATION') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        organizationId: session.user.organizationId,
        date: { lt: new Date() },
      },
      include: {
        reviews: {
          select: {
            rating: true,
            comment: true
          }
        },
        _count: {
          select: { registrations: true }
        }
      }
    })

    const sentimentAnalysis = events.map(event => {
      const reviews = event.reviews
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0

      // Analyze sentiment from comments
      const commentSentiments = reviews
        .filter(r => r.comment)
        .map(r => analyzeSentiment(r.comment))

      const averageCommentSentiment = commentSentiments.length > 0
        ? commentSentiments.reduce((acc, s) => acc + s.comparative, 0) / commentSentiments.length
        : 0

      // Combined sentiment analysis using both ratings and comments
      const combinedSentiments = reviews.map(review => {
        const ratingSentiment = review.rating >= 4 ? 1 : 
                               review.rating <= 2 ? -1 : 0
        const commentSentiment = review.comment 
          ? analyzeSentiment(review.comment).comparative
          : 0

        // Weight: 60% rating, 40% comment sentiment
        return ratingSentiment * 0.6 + (commentSentiment * 0.4)
      })

      return {
        id: event.id,
        title: event.title,
        date: event.date,
        totalReviews: reviews.length,
        averageRating,
        totalRegistrations: event._count.registrations,
        sentiments: {
          positive: combinedSentiments.filter(s => s > 0.2).length,
          neutral: combinedSentiments.filter(s => s >= -0.2 && s <= 0.2).length,
          negative: combinedSentiments.filter(s => s < -0.2).length
        },
        commentSentiment: averageCommentSentiment,
        keywords: extractKeywords(reviews)
      }
    })

    return NextResponse.json({ events: sentimentAnalysis })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiments' },
      { status: 500 }
    )
  }
} 