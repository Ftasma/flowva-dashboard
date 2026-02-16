export async function sendContactFormMessage(
  name: string,
  email: string,
  message: string
) {
  try {
    // Basic validation
    if (!name || !email || !message) {
      throw new Error("Name, email, and message are all required");
    }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`;

    const payload = { name, email, message };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      if (!res.ok) {
        throw new Error(
          `Email sending failed with status ${res.status}: ${responseText.substring(
            0,
            100
          )}`
        );
      }
      responseData = { success: true };
    }

    if (!res.ok) {
      throw new Error(
        responseData.error || `Email sending failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error sending contact form message:", error);
    throw error;
  }
}
