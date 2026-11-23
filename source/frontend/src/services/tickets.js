import api from "./api";

// These list paths match the proposed API contract in docs/week-03/03_API_SPECIFICATION.md.
// The current backend does not expose ticket endpoints yet.
const listPaths = {
  requester: "/tickets/mine/",
  supportAgent: "/tickets/queue/",
};

export async function getDashboardTicketPage(scope, params = {}) {
  const path = listPaths[scope];

  if (!path) {
    throw new Error(`No ticket list contract is defined for scope: ${scope}`);
  }

  const { data } = await api.get(path, { params });

  if (!Array.isArray(data.results) || typeof data.count !== "number") {
    throw new Error("Ticket API response does not match the documented paginated format.");
  }

  return data;
}
