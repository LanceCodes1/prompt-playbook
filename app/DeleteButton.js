"use client"; // this button runs in the browser, so it can show a pop-up

// The Delete button on each card. It asks first, before the form is sent to the server.
export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="rounded border px-3 py-1 text-red-700"
      onClick={(e) => {
        // If they click Cancel, stop the form from sending, so nothing gets deleted
        if (!confirm("Are you sure you want to delete this prompt?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
