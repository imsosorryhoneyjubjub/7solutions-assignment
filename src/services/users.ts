import axios from "axios";

// Define the User type
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  company: Company;
}

export interface Company {
  department: string;
  name: string;
}

export interface UserTransform {
  [key: string]: User[];
}

export async function fetchAndTransformUsers() {
  try {
    const response = await axios.get("https://dummyjson.com/users");
    const users: User[] = response.data.users;

    return users.reduce((acc, user) => {
      if (!acc[user?.company?.department]) {
        acc[user?.company?.department] = [];
      }
      acc[user?.company?.department].push(user);
      return acc;
    }, {} as UserTransform);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
