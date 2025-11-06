import { cookies } from "next/headers";

const TOAST_COOKIE = "x-toast";

export async function ToastBridge() {
  const cookieStore = await cookies();
  const toastValue = cookieStore.get(TOAST_COOKIE)?.value;

  if (!toastValue) {
    return null;
  }

  const serialized = JSON.stringify(toastValue);
  const script = `(function(){window.__X_TOAST__=${serialized};document.cookie='${TOAST_COOKIE}=;path=/;Max-Age=0';})();`;

  return (
    <script
      id="toast-bridge"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
