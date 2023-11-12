export type WorkHours = {
	clockIn: string;
	clockOut: string;
};

export type Employee = {
	code: number;
	name: string;
	username: string;
	password: string;
	title: "manager" | "pharmacist" | "assistant" | "trainee" | "delivery" | "other";
	hourlyRate: number;
	workHours: WorkHours;
};

export type EmployeeFormInput = {
	code: number;
	name: string;
	username: string;
	password: string;
	title: "manager" | "pharmacist" | "assistant" | "trainee" | "delivery" | "other";
	hourlyRate: number;
	clockIn: string;
	clockOut: string;
};
