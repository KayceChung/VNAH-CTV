export type Employee = {
  ID_Employees: string;
  Name: string;
  DoB: string;
  Sex: string;
  Phone: string;
  Zalo: string;
  Email: string;
  Address: string;
  Branch: string;
  Department: string;
  Title: string;
  Working_at: string;
  Ward: string;
  ID_number: string;
  Status: string;
  Pass_word?: string;
};

export type AuthSession = {
  identity: {
    name: string;
    phone: string;
  };
  employee: Employee;
};