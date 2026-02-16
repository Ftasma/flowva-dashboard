import supabase from "../lib/supabase";

const BASE = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function to get auth headers
async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Authentication required");
  }
  return {
    apikey: ANON,
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json"
  };
}

export async function createShare(
  senderId: string,
  itemId: string,
  itemType: "tool" | "collection",
  sharedVia: "email" | "facebook" | "linkedin" | "whatsapp" | "x" | "link",
  recipientEmail?: string
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Authentication required to create share");
    }
    
    const payload = {
      sender_id: senderId,
      item_id: itemId,
      item_type: itemType,
      shared_via: sharedVia,
      ...(recipientEmail && { recipient_email: recipientEmail })
    };

    const res = await fetch(`${BASE}/functions/v1/create_share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`createShare failed with status ${res.status}: ${errorText.substring(0, 100)}`);
      }
      throw new Error(errorData.error || `createShare failed with status ${res.status}`);
    }
    
    return res.json();
  } catch (error: any) {
    console.error("Error creating share:", error);
    throw error;
  }
}

export async function acceptShare(token: string) {
  try {
    const headers = await authHeaders();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      throw new Error("User must be logged in to accept shares");
    }
    
    const res = await fetch(`${BASE}/functions/v1/accept_share`, {
      method: "POST",
      headers,
      body: JSON.stringify({ token, recipient_id: user.id })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`acceptShare failed with status ${res.status}: ${errorText.substring(0, 100)}`);
      }
      throw new Error(errorData.error || `acceptShare failed with status ${res.status}`);
    }
    
    return res.json();
  } catch (error: any) {
    console.error("Error accepting share:", error);
    throw error;
  }
}

export async function getSharedPreview(token: string) {
  try {
    const res = await fetch(
      `${BASE}/functions/v1/get_shared_preview?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`getSharedPreview failed with status ${res.status}: ${errorText.substring(0, 100)}`);
      }
      throw new Error(errorData.error || `getSharedPreview failed with status ${res.status}`);
    }
    
    return res.json();
  } catch (error: any) {
    console.error("Error getting shared preview:", error);
    throw error;
  }
}

export async function sendShareEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  textBody: string
) {
  try {
    // Input validation
    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }
    
    if (!subject) {
      throw new Error("Email subject is required");
    }
    
    if (!htmlBody && !textBody) {
      throw new Error("Either HTML or text content is required");
    }
    
    // Get auth headers
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Authentication required to send emails");
    }
    
    // Prepare request
    const payload = {
      recipient_email: recipientEmail.trim(),
      subject,
      htmlBody,
      textBody
    };
    
    
    // Make API request
    const res = await fetch(`${BASE}/functions/v1/send_share_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload)
    });
    
    // Parse response
    const responseText = await res.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error(`Email sending failed with status ${res.status}: ${responseText.substring(0, 100)}`);
      }
      responseData = { success: true };
    }
    
    // Handle errors
    if (!res.ok) {
      console.error("Email sending error response:", responseData);
      throw new Error(responseData.error || responseData.details || `Email sending failed with status ${res.status}`);
    }
    
    return responseData;
  } catch (error: any) {
    console.error("Error sending share email:", error);
    throw error;
  }
}


export async function fetchTokenFromShortCode(shortCode: string) {
  const res = await fetch(`${BASE}/functions/v1/resolve-shortcode/${shortCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to resolve short code: ${errorText}`);
  }

  const data = await res.json();
  return data.token; 
}