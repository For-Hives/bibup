"use server";

import type { Transaction } from "@/models/transaction.model";

import { pb } from "@/lib/pocketbaseClient";

/**
 * Creates a new transaction record.
 * @param transactionData Data for the new transaction.
 *   Expects: bibId, buyerUserId, sellerUserId, amount (selling price of bib), platformFee, status.
 */
export async function createTransaction(
  transactionData: Omit<Transaction, "id" | "transactionDate">
): Promise<null | Transaction> {
  if (
    !transactionData.bibId ||
    !transactionData.buyerUserId ||
    !transactionData.sellerUserId ||
    transactionData.amount === undefined ||
    transactionData.platformFee === undefined ||
    !transactionData.status
  ) {
    console.error(
      "Missing required fields for transaction creation:",
      transactionData
    );
    return null;
  }

  try {
    const dataToCreate: Omit<Transaction, "id"> = {
      ...transactionData,
      transactionDate: new Date(), // Set current date/time for the transaction
    };

    const record = await pb
      .collection("transactions")
      .create<Transaction>(dataToCreate);
    return record;
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (error && typeof error === "object" && "message" in error) {
      console.error("PocketBase error details:", error.message);
      if (
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        console.error(
          "PocketBase response data:",
          (error.response as any)?.data
        );
      }
    }
    return null;
  }
}
