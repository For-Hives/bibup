import type { Event } from "@/models/event.model";
import type { Bib } from "@/models/bib.model";
import type { Metadata } from "next";

import { getDictionary } from "@/lib/getDictionary";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "@/lib/getLocale";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  fetchBibByIdForSeller,
  updateBibBySeller,
  UpdateBibData,
} from "@/services/bib.services";

type EditBibPageProps = {
  params: { bibId: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // For reading query params
};

// Helper to get status class string from globals.css
const getBibStatusClass = (status: Bib["status"]): string => {
  switch (status) {
    case "expired":
      return "status-expired";
    case "listed_private":
      return "status-approved";
    case "listed_public":
      return "status-approved";
    case "pending_validation":
      return "status-pending";
    case "sold":
      return "status-sold";
    case "validation_failed":
      return "status-rejected";
    case "withdrawn":
      return "status-withdrawn";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default async function EditBibPage({
  searchParams,
  params,
}: EditBibPageProps) {
  const { userId: sellerUserId } = await auth();
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  const { bibId } = params;

  if (!sellerUserId) {
    redirect(`/sign-in?redirect_url=/dashboard/seller/edit-bib/${bibId}`);
  }

  const bibWithEvent = await fetchBibByIdForSeller(bibId, sellerUserId);

  if (!bibWithEvent) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto text-center text-[var(--text-dark)]">
        <p className="p-4 mb-6 bg-[var(--error-bg)] text-[var(--error-text)] rounded-lg border border-red-300">
          Bib not found or you do not have permission to edit it.
        </p>
        <Link
          className="text-[var(--accent-sporty)] hover:underline"
          href="/dashboard/seller"
        >
          Back to Seller Dashboard
        </Link>
      </div>
    );
  }

  const eventName =
    bibWithEvent.expand?.eventId?.name ||
    bibWithEvent.unlistedEventName ||
    `Event ID: ${bibWithEvent.eventId || "N/A"}`;
  const successMessage = searchParams?.success
    ? decodeURIComponent(searchParams.success as string)
    : null;
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error as string)
    : null;

  async function handleUpdateBibDetails(formData: FormData) {
    "use server";
    const dataToUpdate: UpdateBibData = {
      originalPrice: formData.get("originalPrice")
        ? parseFloat(formData.get("originalPrice") as string)
        : undefined,
      gender: formData.get("gender") as Bib["gender"] | undefined,
      price: parseFloat(formData.get("price") as string),
      size: formData.get("size") as string | undefined,
    };

    if (isNaN(dataToUpdate.price!) || dataToUpdate.price! <= 0) {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Valid price is required.")}`,
      );
      return;
    }

    const updatedBib = await updateBibBySeller(
      bibId,
      dataToUpdate,
      sellerUserId,
    );
    if (updatedBib) {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent("Bib details updated successfully!")}`,
      );
    } else {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to update bib details.")}`,
      );
    }
  }

  async function handleWithdrawBib() {
    "use server";
    const updatedBib = await updateBibBySeller(
      bibId,
      { status: "withdrawn" },
      sellerUserId,
    );
    if (updatedBib) {
      redirect(
        `/dashboard/seller?success=${encodeURIComponent("Bib listing withdrawn.")}&bibStatus=withdrawn`,
      );
    } else {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to withdraw bib.")}`,
      );
    }
  }

  async function handleToggleListingStatus(
    newStatus: "listed_private" | "listed_public",
  ) {
    "use server";
    if (
      bibWithEvent?.status === "pending_validation" &&
      newStatus === "listed_public"
    ) {
      // Allow this. Future: check if admin approved.
    } else if (
      bibWithEvent?.status === "pending_event_verification" &&
      newStatus === "listed_public"
    ) {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot make public until event details are verified by admin.`)}`,
      );
      return;
    } else if (
      bibWithEvent?.status !== "listed_public" &&
      bibWithEvent?.status !== "listed_private" &&
      bibWithEvent?.status !== "withdrawn" &&
      bibWithEvent?.status !== "pending_validation"
    ) {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent(`Cannot change listing status from ${bibWithEvent?.status}.`)}`,
      );
      return;
    }

    const updatedBib = await updateBibBySeller(
      bibId,
      { status: newStatus },
      sellerUserId,
    );
    if (updatedBib) {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?success=${encodeURIComponent(`Bib status changed to ${newStatus.replace("_", " ")}.`)}`,
      );
    } else {
      redirect(
        `/dashboard/seller/edit-bib/${bibId}?error=${encodeURIComponent("Failed to change bib status.")}`,
      );
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto text-[var(--text-dark)]">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Edit Bib Listing</h1>
        <p className="text-md mt-1">
          <strong>Event:</strong> {eventName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Reg #:</strong> {bibWithEvent.registrationNumber}
        </p>
      </header>

      {successMessage && (
        <div className="p-3 mb-4 bg-[var(--success-bg)] text-[var(--success-text)] rounded-md border border-green-300 text-center text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 mb-4 bg-[var(--error-bg)] text-[var(--error-text)] rounded-md border border-red-300 text-center text-sm">
          Error: {errorMessage}
        </div>
      )}

      <div className="bento-box mb-8">
        {" "}
        {/* Using bento-box for the form container */}
        <form action={handleUpdateBibDetails} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Selling Price ($):
            </label>
            <input
              className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600"
              defaultValue={bibWithEvent.price}
              id="price"
              min="0.01"
              name="price"
              required
              step="0.01"
              type="number"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="originalPrice"
            >
              Original Price ($) (Optional):
            </label>
            <input
              className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600"
              defaultValue={bibWithEvent.originalPrice || ""}
              id="originalPrice"
              min="0.00"
              name="originalPrice"
              step="0.01"
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="size">
              Size (Optional):
            </label>
            <input
              className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600"
              defaultValue={bibWithEvent.size || ""}
              id="size"
              name="size"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gender">
              Gender (Optional):
            </label>
            <select
              className="w-full p-2 border border-[var(--border-color)] rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600"
              defaultValue={bibWithEvent.gender || ""}
              id="gender"
              name="gender"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Save Changes
          </button>
        </form>
      </div>

      <div className="bento-box">
        <h2 className="text-lg font-semibold mb-3">Manage Listing Status</h2>
        <p className="text-sm mb-3">
          Current Status:
          <span
            className={`status-badge ${getBibStatusClass(bibWithEvent.status)} ml-2`}
          >
            {bibWithEvent.status.replace(/_/g, " ").toUpperCase()}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <form action={handleWithdrawBib}>
            <button
              className="btn btn-withdraw"
              disabled={
                bibWithEvent.status === "sold" ||
                bibWithEvent.status === "withdrawn" ||
                bibWithEvent.status === "expired"
              }
              type="submit"
            >
              Withdraw Listing
            </button>
          </form>

          {(bibWithEvent.status === "listed_private" ||
            bibWithEvent.status === "pending_validation" ||
            bibWithEvent.status === "withdrawn") &&
            bibWithEvent.status !== "pending_event_verification" && (
              <form action={() => handleToggleListingStatus("listed_public")}>
                <button
                  className="btn btn-secondary bg-green-500 hover:bg-green-600 text-white"
                  type="submit"
                >
                  Make Public
                </button>
              </form>
            )}

          {bibWithEvent.status === "listed_public" && (
            <form action={() => handleToggleListingStatus("listed_private")}>
              <button
                className="btn btn-secondary bg-purple-500 hover:bg-purple-600 text-white"
                type="submit"
              >
                Make Private
              </button>
            </form>
          )}
        </div>
        {bibWithEvent.status === "pending_event_verification" && (
          <p className="text-xs text-orange-600 mt-2">
            This bib cannot be made public until event details are verified by
            an admin.
          </p>
        )}
      </div>

      <Link
        className="block text-center mt-8 text-[var(--accent-sporty)] hover:underline"
        href="/dashboard/seller"
      >
        Back to Seller Dashboard
      </Link>
    </div>
  );
}

export async function generateMetadata({
  params,
}: EditBibPageProps): Promise<Metadata> {
  return {
    title: `Edit Bib ${params.bibId} | Seller Dashboard | BibUp`,
  };
}
