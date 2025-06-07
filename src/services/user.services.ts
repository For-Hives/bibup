import pb from "@/lib/pocketbaseClient";
import { User } from "@/models/user.model";

/**
 * Fetches a user profile from PocketBase by their Clerk ID.
 * @param clerkId - The Clerk ID of the user.
 * @returns The user profile as a User object, or null if not found.
 */
export async function getUserProfileByClerkId(clerkId: string): Promise<User | null> {
  try {
    const record = await pb.collection('users').getFirstListItem<User>(`clerkId = "${clerkId}"`);
    return record;
  } catch (error: any) {
    // PocketBase throws an error if no record is found (status 404)
    if (error.status === 404) {
      return null;
    }
    console.error("Failed to fetch user profile by Clerk ID:", error);
    // Optionally, re-throw the error or handle it as per application's needs
    // throw error;
    return null; // Or return null/undefined to indicate failure without crashing
  }
}

/**
 * Creates a new user profile in PocketBase.
 * @param userData - Object containing user data (clerkId, email, username?, firstName?, lastName?, profileImageUrl?).
 * @returns The created user profile as a User object.
 */
export async function createUserProfile(userData: {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}): Promise<User> {
  try {
    const data = {
      clerkId: userData.clerkId,
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      // PocketBase automatically handles createdAt and updatedAt
    };
    const record = await pb.collection('users').create<User>(data);
    return record;
  } catch (error) {
    console.error("Failed to create user profile:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Fetches a user profile if it exists, otherwise creates a new one.
 * Useful for syncing Clerk users to the local database.
 * @param userData - Object containing user data (clerkId, email, username?, firstName?, lastName?, profileImageUrl?).
 * @returns The existing or newly created user profile as a User object.
 */
export async function getOrCreateUserProfile(userData: {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}): Promise<User> {
  try {
    const existingUser = await getUserProfileByClerkId(userData.clerkId);
    if (existingUser) {
      return existingUser;
    }

    // User does not exist, create a new profile
    // Ensure all required fields for User model are passed if createUserProfile expects them
    // For example, if User model has non-optional fields not in userData, they need to be handled
    const newUser = await createUserProfile(userData);
    return newUser;
  } catch (error) {
    console.error("Failed to get or create user profile:", error);
    // Depending on how critical this operation is, you might want to re-throw,
    // or handle it in a way that doesn't break the user flow.
    throw error;
  }
}
