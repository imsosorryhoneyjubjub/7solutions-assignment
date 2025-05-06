import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Company, fetchAndTransformUsers } from "@/services/users";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  company: Company;
}

describe("fetchAndTransformUsers", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should correctly group users by department", async () => {
    const mockUsers: { users: User[] } = {
      users: [
        {
          id: 1,
          firstName: "Alice",
          lastName: "Smith",
          company: { department: "Engineering", name: "abc" },
        },
        {
          id: 2,
          firstName: "Bob",
          lastName: "Brown",
          company: { department: "Engineering", name: "rgb" },
        },
        {
          id: 3,
          firstName: "Charlie",
          lastName: "Davis",
          company: { department: "HR", name: "xyz" },
        },
      ],
    };

    // Mock Axios GET request
    mock.onGet("https://dummyjson.com/users").reply(200, mockUsers);

    const result = await fetchAndTransformUsers();

    // Expected return value
    const expectedOutput: Record<string, User[]> = {
      Engineering: [
        {
          id: 1,
          firstName: "Alice",
          lastName: "Smith",
          company: { department: "Engineering", name: "abc" },
        },
        {
          id: 2,
          firstName: "Bob",
          lastName: "Brown",
          company: { department: "Engineering", name: "rgb" },
        },
      ],
      HR: [
        {
          id: 3,
          firstName: "Charlie",
          lastName: "Davis",
          company: { department: "HR", name: "xyz" },
        },
      ],
    };

    expect(result).toEqual(expectedOutput);
  });

  it("should handle API errors gracefully", async () => {
    mock.onGet("https://dummyjson.com/users").reply(500);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await fetchAndTransformUsers();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error fetching users:"),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
