"use client"; // this button runs in the browser, so it can show a pop-up

// The Delete button on each card. It asks first, before the form is sent to the server.
export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="min-h-11 rounded-full border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition duration-200 hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/60"
      onClick={(e) => {
        // If they click Cancel, stop the form from sending, so nothing gets deleted
        if (!confirm("Are you sure you want to delete this prompt?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
