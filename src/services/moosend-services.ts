import supabase from "../lib/supabase";

export const addToAwaitingVerificationList = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("awaiting", {
      body: {
        email,
      },
    });

    if (error) {
      console.error("Error adding to awaiting verification list:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to add to awaiting verification list:", error);
    throw error;
  }
};




export const moveToNotOnboardedList = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("move-to-notonboarded", {
      body: { email },
    });

    if (error) {
      console.error("Error moving to Not Onboarded list:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to move to Not Onboarded list:", error);
    throw error;
  }
};

export const moveToVerifiedAndOnboarded = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("add-user-list");

    if (error) {
      console.error("Error moving to verified users list:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to move to verified users list:", error);
    throw error;
  }
};


export const addToNewsletter = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("add-to-newsletter", {
      body: {
        email,
      },
    });

    if (error) {
      console.error("Error adding to newsletter list:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to add to newsletter list:", error);
    throw error;
  }
};


export const addUserToContestList = async (info: any) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "challenge-contest",
      {
        body: { ...info },
      }
    );

    if (error) {
      console.error("Error moving to contest list:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to move to contest list:", error);
    throw error;
  }
};