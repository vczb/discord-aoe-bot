import { log } from "../utils.js";

export const handleWebhookCommand = (req: any, res: any): void => {
  log("Received webhook payload:", req.body);

  // 1. Safely access the payload. We assume the 'type' field exists on the body.
  // In a real scenario, rigorous type checking is vital.
  const payloadType: number | undefined = req.body.type;

  // 2. Check the condition: If the type is 0 (PING).
  if (payloadType === 0) {
    log("Detected PING request (Type 0). Sending 204.");

    // 3. Send the required 204 No Content status code and end the response stream.
    // This precisely matches Flask's Response(status=204).
    return res.status(204).end();
  }

  // 4. Handle cases where the type is not 0 or is missing.
  else {
    log(
      `Received non-PING request. Type found: ${payloadType}. Sending success 204.`,
    );

    // For non-PING events, the requirement is still usually 204
    // after successful processing, but we might log additional details here.
    return res.status(204).end();
  }
};
