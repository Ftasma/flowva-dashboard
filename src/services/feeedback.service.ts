import supabase from "../lib/supabase";

// Types
export interface FeedbackSubmission {
  user_id: string;
  content: string;
}

export interface FeedbackResponse {
  success: boolean;
  feedback_id?: string;
  error?: string;
  status?: number;
}

// Custom error type for handling feedback-related errors
export class FeedbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeedbackError';
  }
}

/**
 * Submit feedback to the backend
 * @param feedback - The feedback data to submit
 * @returns Promise with the response data
 */
export async function submitFeedback(feedback: FeedbackSubmission): Promise<FeedbackResponse> {
    
  try {
    // Get authentication session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Get environment variables using Vite's import.meta.env
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Check if environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return {
        success: false,
        error: 'Configuration error: Missing API credentials'
      };
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/submit_feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${token || supabaseAnonKey}`
        },
        body: JSON.stringify(feedback)
        
      }

    );

    const data = await response.json();

    if (!response.ok) {
      throw new FeedbackError(data.error || 'Failed to submit feedback');
    }

    return {
      success: true,
      feedback_id: data.feedback_id,
      status: response.status
    };
  } catch (error: unknown) {
    console.error('Feedback service error:', error);
    
    // Handle the error based on its type
    if (error instanceof FeedbackError) {
      return {
        success: false,
        error: error.message
      };
    } else if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'An unknown error occurred while submitting feedback'
      };
    } else {
      return {
        success: false,
        error: 'An unknown error occurred while submitting feedback'
      };
    }
  }
}

/**
 * Get all feedback for a user
 * @param userId - The user ID to get feedback for
 * @returns Promise with the user's feedback history
 */
export async function getUserFeedback(userId: string) {
  try {
    // Get authentication session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new FeedbackError('Missing Supabase configuration');
    }
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/feedback?user_id=eq.${userId}&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${token || supabaseAnonKey}`
        }
      }
    );

    if (!response.ok) {
      throw new FeedbackError('Failed to fetch user feedback');
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error fetching user feedback:', error);
    throw error instanceof Error ? error : new FeedbackError('Unknown error fetching user feedback');
  }
}

/**
 * Get all feedback (admin function)
 * @returns Promise with all feedback entries
 */
export async function getAllFeedback() {
  try {
    // Get authentication session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new FeedbackError('Missing Supabase configuration');
    }
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/feedback?order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${token || supabaseAnonKey}`
        }
      }
    );

    if (!response.ok) {
      throw new FeedbackError('Failed to fetch feedback');
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error fetching all feedback:', error);
    throw error instanceof Error ? error : new FeedbackError('Unknown error fetching all feedback');
  }
}

/**
 * Update feedback status
 * @param feedbackId - The ID of the feedback to update
 * @param status - The new status
 * @returns Promise with the update result
 */
export async function updateFeedbackStatus(feedbackId: string, status: string) {
  try {
    // Get authentication session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new FeedbackError('Missing Supabase configuration');
    }
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/feedback?id=eq.${feedbackId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${token || supabaseAnonKey}`
        },
        body: JSON.stringify({
          status,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new FeedbackError('Failed to update feedback status');
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating feedback status:', error);
    throw error instanceof Error ? error : new FeedbackError('Unknown error updating feedback status');
  }
}

/**
 * Complete feedback service with all feedback-related API calls
 */
const FeedbackService = {
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  updateFeedbackStatus
};

export default FeedbackService;